import {
  context,
  settings,
  sameOrigin,
  billingError,
  BillingError,
} from "@/app/lib/billing/access";
import {
  Workspace,
  Commission,
  Withdrawal,
  BankRecipient,
} from "@/app/models/Billing";
import {
  requestWithdrawal,
  releaseCommissions,
} from "@/app/lib/billing/withdrawals";
import { paystack } from "@/app/lib/billing/paystack";
import { allowAttempt } from "@/app/lib/rate-limit";
export async function GET() {
  try {
    const { workspace, mode } = await context();
    await releaseCommissions(workspace._id, mode);
    const sums = await Commission.aggregate([
      { $match: { workspaceId: workspace._id, mode, onHold: { $ne: true } } },
      {
        $group: {
          _id: "$state",
          amount: { $sum: { $subtract: ["$amount", "$reversedAmount"] } },
        },
      },
    ]);
    return Response.json({
      code: workspace.referralCode,
      enabled: workspace.referralEnabled,
      policy: (await settings()).referral,
      totals: Object.fromEntries(sums.map((row) => [row._id, row.amount])),
      ledger: await Commission.find({ workspaceId: workspace._id, mode })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean(),
      withdrawals: await Withdrawal.find({ workspaceId: workspace._id, mode })
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
      bank: await BankRecipient.findOne({ workspaceId: workspace._id, mode })
        .select("label")
        .lean(),
      conversions: await Commission.countDocuments({
        workspaceId: workspace._id,
        mode,
      }),
    });
  } catch (error) {
    return billingError(error);
  }
}
export async function POST(request) {
  try {
    sameOrigin(request);
    const { workspace, mode, user } = await context();
    if (!(await allowAttempt(`referrals:${user._id}`, 20)))
      throw new BillingError("Please wait before trying again.", 429);
    const body = await request.json();
    if (body.action === "attribute") {
      const target =
        typeof body.code === "string" && /^[A-Z0-9]{6,32}$/i.test(body.code)
          ? await Workspace.findOne({
              referralCode: body.code.toUpperCase(),
              referralEnabled: true,
            })
          : null;
      const capturedAt = new Date(body.capturedAt);
      const days = (await settings()).referral.attributionDays;
      if (
        target &&
        Number.isFinite(capturedAt.getTime()) &&
        capturedAt <= new Date() &&
        capturedAt.getTime() + days * 86400000 > Date.now() &&
        String(target.ownerId) !== String(user._id)
      )
        await Workspace.updateOne(
          { _id: workspace._id, referredBy: { $exists: false } },
          { referredBy: target._id, attributedAt: capturedAt },
        );
      return Response.json({ success: true });
    }
    if (body.action === "withdraw") {
      const row = await requestWithdrawal(workspace._id, mode);
      return Response.json({ reference: row.reference });
    }
    if (body.action === "banks")
      return Response.json({
        banks: await paystack(
          "/bank?country=nigeria&currency=NGN&perPage=100",
          undefined,
          mode,
        ),
      });
    if (body.action === "bank") {
      if (
        !/^\d{10}$/.test(body.accountNumber || "") ||
        !/^\d{3,10}$/.test(body.bankCode || "")
      )
        throw new BillingError("Enter a valid Nigerian bank account.");
      const resolved = await paystack(
        `/bank/resolve?account_number=${body.accountNumber}&bank_code=${body.bankCode}`,
        undefined,
        mode,
      );
      const recipient = await paystack(
        "/transferrecipient",
        {
          type: "nuban",
          name: resolved.account_name,
          account_number: body.accountNumber,
          bank_code: body.bankCode,
          currency: "NGN",
        },
        mode,
      );
      await BankRecipient.findOneAndUpdate(
        { workspaceId: workspace._id, mode },
        {
          recipientCode: recipient.recipient_code,
          label: `${resolved.account_name} · ••••${body.accountNumber.slice(-4)}`,
        },
        { upsert: true },
      );
      return Response.json({ success: true });
    }
    throw new BillingError("Unknown referral action.");
  } catch (error) {
    return billingError(error);
  }
}
