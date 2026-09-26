import "server-only";
import {
  Order,
  Subscription,
  Workspace,
  WebhookEvent,
  Commission,
  RefundRecord,
  Withdrawal,
} from "@/app/models/Billing";
import { fulfill, transaction } from "./service";
import { paystack } from "./paystack";
import { refundCommission } from "@/lib/billing-rules";

export function eventPayload(data) {
  // Persist only fields needed for recovery, never entire authorization/card objects.
  return {
    id: data.id,
    reference: data.reference,
    domain: data.domain,
    amount: data.amount,
    status: data.status,
    paid: data.paid,
    period_start: data.period_start,
    period_end: data.period_end,
    subscription_code: data.subscription_code,
    subscription: data.subscription && {
      subscription_code: data.subscription.subscription_code,
    },
    customer: data.customer && { customer_code: data.customer.customer_code },
    plan: data.plan && { plan_code: data.plan.plan_code },
    transaction:
      data.transaction &&
      (typeof data.transaction === "object"
        ? { id: data.transaction.id, reference: data.transaction.reference }
        : data.transaction),
  };
}
async function subscriptionEvent(event) {
  const { payload: data, mode } = event;
  const code = data.subscription_code || data.subscription?.subscription_code;
  if (!code) throw new Error("Subscription identifier missing");
  const remote = await paystack(
    `/subscription/${encodeURIComponent(code)}`,
    undefined,
    mode,
  );
  let row = await Subscription.findOne({ mode, providerCode: code });
  if (!row && (await Subscription.exists({ mode, priorProviderCodes: code })))
    return;
  if (!row && event.type === "subscription.create") {
    row = await Subscription.findOne({
      mode,
      providerCustomer: remote.customer?.customer_code,
      "plan.providerPlan": remote.plan?.plan_code,
      renewalState: { $in: ["creating", "uncertain"] },
    });
    if (row)
      await Subscription.updateOne(
        { _id: row._id },
        {
          providerCode: code,
          providerToken: remote.email_token,
          renewalState: "enabled",
        },
      );
  }
  if (!row) throw new Error("Subscription awaiting local mapping");
  if (
    remote.customer?.customer_code !== row.providerCustomer ||
    remote.plan?.plan_code !== row.plan.providerPlan
  )
    throw new Error("Subscription owner mismatch");
  if (
    event.type === "invoice.update" &&
    data.paid &&
    data.transaction?.reference
  ) {
    const start = new Date(data.period_start),
      end = new Date(data.period_end);
    if (
      !Number.isFinite(start.getTime()) ||
      !Number.isFinite(end.getTime()) ||
      end <= start ||
      end - start > 370 * 86400000 ||
      data.amount !== row.plan.amount
    )
      throw new Error("Invalid renewal period or amount");
    const initial = await Order.findOne({
      workspaceId: row.workspaceId,
      mode,
      status: "paid",
      providerCustomer: row.providerCustomer,
    }).sort({ paidAt: 1 });
    if (!initial) throw new Error("Original purchase not found");
    await Order.updateOne(
      { reference: data.transaction.reference, mode },
      {
        $setOnInsert: {
          workspaceId: row.workspaceId,
          userId: initial.userId,
          email: initial.email,
          mode,
          reference: data.transaction.reference,
          plan: row.plan,
          amount: row.plan.amount,
          discount: 0,
          firstPayment: false,
          recurring: false,
          providerPeriod: true,
          periodStart: start,
          periodEnd: end,
          referrerId: initial.referrerId,
          referralPolicy: initial.referralPolicy,
        },
      },
      { upsert: true },
    );
    await fulfill(data.transaction.reference, mode);
  }
  // Read the provider's current state rather than trusting the delivery order of events.
  const cancelled = [
    "cancelled",
    "completed",
    "complete",
    "non-renewing",
  ].includes(remote.status);
  await Subscription.updateOne(
    { _id: row._id, updatedAt: row.updatedAt },
    {
      $set: {
        cancelAtPeriodEnd: cancelled,
        renewalState: cancelled ? "cancelled" : "enabled",
        ...(row.status === "suspended"
          ? {}
          : { status: remote.status === "attention" ? "past_due" : "active" }),
      },
    },
  );
}
async function refundEvent(event) {
  const remote = await paystack(
    `/refund/${encodeURIComponent(event.payload.id)}`,
    undefined,
    event.mode,
  );
  if (remote.status !== "processed")
    throw new Error("Refund has not finished processing");
  const providerId = String(remote.transaction?.id || remote.transaction);
  const order = await Order.findOne({ mode: event.mode, providerId });
  if (!order) throw new Error("Refund transaction not found");
  if (
    remote.currency !== "NGN" ||
    !Number.isSafeInteger(remote.amount) ||
    remote.amount < 0
  )
    throw new Error("Invalid refund");
  await RefundRecord.init();
  await transaction(async (session) => {
    await Workspace.updateOne(
      { _id: order.workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    if (
      await RefundRecord.exists({
        mode: event.mode,
        providerId: String(remote.id),
      }).session(session)
    )
      return;
    const current = await Order.findById(order._id).session(session);
    const total = current.refundedAmount + remote.amount;
    if (total > current.amount)
      throw new Error("Refund exceeds original amount");
    await RefundRecord.create(
      [
        {
          mode: event.mode,
          providerId: String(remote.id),
          orderId: order._id,
          amount: remote.amount,
        },
      ],
      { session },
    );
    await Order.updateOne(
      { _id: order._id },
      { refundedAmount: total },
      { session },
    );
    const commission = await Commission.findOne({ orderId: order._id }).session(
      session,
    );
    if (commission) {
      // Paid reversals remain in the ledger and are deducted from future withdrawal availability.
      await Workspace.updateOne(
        { _id: commission.workspaceId },
        { $inc: { revision: 1 } },
        { session },
      );
      commission.reversedAmount = refundCommission(
        commission.amount,
        current.amount,
        total,
      );
      if (
        !["paid", "reserved"].includes(commission.state) &&
        commission.reversedAmount === commission.amount
      )
        commission.state = "reversed";
      await commission.save({ session });
    }
  });
}
export async function processEvent(id) {
  const event = await WebhookEvent.findOneAndUpdate(
    {
      _id: id,
      status: { $ne: "processed" },
      $or: [
        { leaseUntil: { $exists: false } },
        { leaseUntil: { $lt: new Date() } },
      ],
    },
    {
      $set: { leaseUntil: new Date(Date.now() + 120000), status: "processing" },
      $inc: { attempts: 1 },
    },
    { new: true },
  ).select("+payload");
  if (!event) return;
  try {
    if (event.type === "charge.success") {
      if (
        await Order.exists({
          reference: event.payload.reference,
          mode: event.mode,
        })
      )
        await fulfill(event.payload.reference, event.mode);
      // Recurring charges are paired with invoice.update, which supplies the exact paid period.
    } else if (
      [
        "subscription.create",
        "subscription.not_renew",
        "subscription.disable",
        "invoice.payment_failed",
        "invoice.update",
      ].includes(event.type)
    )
      await subscriptionEvent(event);
    else if (event.type === "refund.processed") await refundEvent(event);
    else if (event.type.startsWith("charge.dispute")) {
      const reference = event.payload.transaction?.reference;
      const providerId =
        event.payload.transaction?.id ||
        (typeof event.payload.transaction !== "object"
          ? event.payload.transaction
          : null);
      const order = await Order.findOne({
        mode: event.mode,
        ...(reference ? { reference } : { providerId: String(providerId) }),
      });
      if (order) {
        await transaction(async (session) => {
          await Workspace.updateOne(
            { _id: order.workspaceId },
            { $inc: { revision: 1 } },
            { session },
          );
          await Order.updateOne(
            { _id: order._id },
            { disputed: true },
            { session },
          );
          const commission = await Commission.findOne({
            orderId: order._id,
          }).session(session);
          if (commission) {
            await Workspace.updateOne(
              { _id: commission.workspaceId },
              { $inc: { revision: 1 } },
              { session },
            );
            await Commission.updateOne(
              { _id: commission._id },
              { onHold: true },
              { session },
            );
          }
        });
      }
      // Review is required; never automatically remove a customer's existing paid period.
      throw new Error("Dispute requires finance review in Paystack");
    } else if (event.type.startsWith("transfer.")) {
      const withdrawal = await Withdrawal.findOne({
        reference: event.payload.reference,
        mode: event.mode,
      });
      if (withdrawal) {
        const { reconcileWithdrawal } = await import("./withdrawals");
        await reconcileWithdrawal(withdrawal);
      }
    }
    await WebhookEvent.updateOne(
      { _id: id },
      {
        $set: { status: "processed", processedAt: new Date(), error: null },
        $unset: { leaseUntil: 1 },
      },
    );
  } catch (error) {
    await WebhookEvent.updateOne(
      { _id: id },
      {
        $set: { status: "failed", error: error.message.slice(0, 250) },
        $unset: { leaseUntil: 1 },
      },
    );
  }
}
