import "server-only";
import crypto from "node:crypto";
import {
  Commission,
  Withdrawal,
  Workspace,
  BankRecipient,
  AuditLog,
} from "@/app/models/Billing";
import { settings, BillingError } from "./access";
import { transaction } from "./service";
import { paystack } from "./paystack";
export async function releaseCommissions(workspaceId, mode) {
  await Commission.updateMany(
    {
      workspaceId,
      mode,
      state: "pending",
      onHold: { $ne: true },
      availableAt: { $lte: new Date() },
    },
    { state: "available" },
  );
}
export async function requestWithdrawal(workspaceId, mode) {
  const policy = (await settings()).referral;
  if (
    !Number.isSafeInteger(policy.minimumWithdrawal) ||
    policy.minimumWithdrawal < 1
  )
    throw new BillingError(
      "Withdrawals will open once the minimum payout is configured.",
      409,
    );
  const recipient = await BankRecipient.findOne({ workspaceId, mode }).select(
    "+recipientCode",
  );
  if (!recipient) throw new BillingError("Verify your bank account first.");
  await releaseCommissions(workspaceId, mode);
  await Withdrawal.init();
  return transaction(async (session) => {
    await Workspace.updateOne(
      { _id: workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    if (
      await Withdrawal.exists({
        workspaceId,
        mode,
        state: { $in: ["requested", "transferring", "pending", "uncertain"] },
      }).session(session)
    )
      throw new BillingError("A withdrawal is already being processed.", 409);
    const available = await Commission.find({
      workspaceId,
      mode,
      state: "available",
      onHold: { $ne: true },
    }).session(session);
    const paid = await Commission.find({
      workspaceId,
      mode,
      state: "paid",
    }).session(session);
    const prior = await Withdrawal.find({
      workspaceId,
      mode,
      state: "paid",
    }).session(session);
    const debt = Math.max(
      0,
      paid.reduce((sum, row) => sum + row.reversedAmount, 0) -
        prior.reduce((sum, row) => sum + row.recoveryAmount, 0),
    );
    const gross = available.reduce(
      (sum, row) => sum + row.amount - row.reversedAmount,
      0,
    );
    const amount = gross - debt;
    if (amount < policy.minimumWithdrawal)
      throw new BillingError(
        "Your available earnings are below the withdrawal minimum, after any refund adjustments.",
      );
    const [withdrawal] = await Withdrawal.create(
      [
        {
          workspaceId,
          mode,
          amount,
          recoveryAmount: debt,
          reference: `aff_${mode}_${crypto.randomBytes(16).toString("hex")}`,
          recipientCode: recipient.recipientCode,
          bankLabel: recipient.label,
        },
      ],
      { session },
    );
    await Commission.updateMany(
      { _id: { $in: available.map((row) => row._id) }, state: "available" },
      { state: "reserved", withdrawalId: withdrawal._id },
      { session },
    );
    return withdrawal;
  });
}
export async function rejectWithdrawal(id, actor, reason) {
  await transaction(async (session) => {
    const row = await Withdrawal.findOne({
      _id: id,
      state: "requested",
    }).session(session);
    if (!row)
      throw new BillingError("Only a pending review can be rejected.", 409);
    await Workspace.updateOne(
      { _id: row.workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    row.state = "rejected";
    row.reason = reason;
    await row.save({ session });
    await Commission.updateMany(
      { withdrawalId: row._id, state: "reserved" },
      { $set: { state: "available" }, $unset: { withdrawalId: 1 } },
      { session },
    );
    await AuditLog.create(
      [
        {
          actorId: actor._id,
          action: "withdrawal.reject",
          resource: String(id),
          reason,
        },
      ],
      { session },
    );
  });
}
export async function approveWithdrawal(id, actor, reason) {
  if (process.env.PAYSTACK_TRANSFERS_ENABLED !== "true")
    throw new BillingError(
      "Transfers are not enabled on this deployment.",
      409,
    );
  const row = await transaction(async (session) => {
    const pending = await Withdrawal.findOne({ _id: id, state: "requested" })
      .select("+recipientCode")
      .session(session);
    if (!pending)
      throw new BillingError("This withdrawal has already been handled.", 409);
    await Workspace.updateOne(
      { _id: pending.workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    const entries = await Commission.find({
      withdrawalId: pending._id,
      state: "reserved",
    }).session(session);
    if (entries.some((entry) => entry.onHold))
      throw new BillingError(
        "A commission in this withdrawal is under dispute review.",
        409,
      );
    if (
      entries.reduce(
        (sum, entry) => sum + entry.amount - entry.reversedAmount,
        0,
      ) !==
      pending.amount + pending.recoveryAmount
    )
      throw new BillingError(
        "Earnings changed after a refund. Reject this request so the customer can submit an updated one.",
        409,
      );
    pending.state = "transferring";
    pending.approvedBy = actor._id;
    await pending.save({ session });
    await AuditLog.create(
      [
        {
          actorId: actor._id,
          action: "withdrawal.approve",
          resource: String(id),
          reason,
          after: { amount: pending.amount, reference: pending.reference },
        },
      ],
      { session },
    );
    return pending;
  });
  try {
    const result = await paystack(
      "/transfer",
      {
        source: "balance",
        amount: row.amount,
        recipient: row.recipientCode,
        reason: "QR referral earnings",
        reference: row.reference,
      },
      row.mode,
    );
    await Withdrawal.updateOne(
      { _id: row._id, state: "transferring" },
      { state: "pending", providerCode: result.transfer_code },
    );
    await reconcileWithdrawal(row);
  } catch {
    await Withdrawal.updateOne(
      { _id: row._id, state: { $in: ["transferring", "pending"] } },
      { state: "uncertain" },
    );
  }
}
export async function reconcileWithdrawal(row) {
  const remote = await paystack(
    `/transfer/verify/${encodeURIComponent(row.reference)}`,
    undefined,
    row.mode,
  );
  const current = await Withdrawal.findById(row._id).select("+recipientCode");
  if (
    remote.reference !== current.reference ||
    remote.amount !== current.amount ||
    remote.currency !== "NGN" ||
    remote.recipient?.recipient_code !== current.recipientCode
  )
    throw new Error("Transfer mismatch");
  if (!["success", "failed", "reversed"].includes(remote.status)) return;
  await transaction(async (session) => {
    const latest = await Withdrawal.findById(row._id).session(session);
    await Workspace.updateOne(
      { _id: row.workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    if (["requested", "rejected"].includes(latest.state))
      throw new Error("Transfer was not approved");
    if (remote.status === "success") {
      latest.state = "paid";
      await latest.save({ session });
      await Commission.updateMany(
        { withdrawalId: row._id, state: "reserved" },
        { state: "paid" },
        { session },
      );
    } else {
      latest.state = remote.status;
      await latest.save({ session });
      await Commission.updateMany(
        { withdrawalId: row._id, state: { $in: ["reserved", "paid"] } },
        { $set: { state: "available" }, $unset: { withdrawalId: 1 } },
        { session },
      );
    }
  });
}
