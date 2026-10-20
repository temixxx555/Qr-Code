import crypto from "node:crypto";
import { connectDB } from "@/app/lib/mongodb";
import {
  WebhookEvent,
  Order,
  Withdrawal,
  Subscription,
} from "@/app/models/Billing";
import { billingMode, paystack } from "@/app/lib/billing/paystack";
import { processEvent } from "@/app/lib/billing/events";
import { fulfill } from "@/app/lib/billing/service";
import { reconcileWithdrawal } from "@/app/lib/billing/withdrawals";
function authorized(request) {
  const supplied =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  // Vercel Cron sends CRON_SECRET; manual recovery calls use BILLING_RECONCILE_SECRET.
  return [process.env.BILLING_RECONCILE_SECRET, process.env.CRON_SECRET].some(
    (expected) =>
      expected &&
      expected.length >= 32 &&
      Buffer.byteLength(expected) === Buffer.byteLength(supplied) &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(supplied)),
  );
}
export const GET = POST;
export async function POST(request) {
  if (!authorized(request))
    return new Response("Unauthorized", { status: 401 });
  await connectDB();
  const mode = billingMode();
  const events = await WebhookEvent.find({ mode, status: { $ne: "processed" } })
    .sort({ updatedAt: 1 })
    .limit(10);
  for (const event of events) await processEvent(event._id);
  let verified = 0,
    pending = 0;
  // Abandoned checkouts stay pending forever; only recheck recent ones.
  const orders = await Order.find({
    mode,
    status: "pending",
    createdAt: { $gt: new Date(Date.now() - 3 * 86400000) },
  })
    .sort({ lastCheckedAt: 1 })
    .limit(20);
  for (const order of orders) {
    try {
      await fulfill(order.reference, mode);
      verified++;
    } catch {
      pending++;
    } finally {
      await Order.updateOne({ _id: order._id }, { lastCheckedAt: new Date() });
    }
  }
  const withdrawals = await Withdrawal.find({
    mode,
    state: { $in: ["pending", "uncertain", "transferring"] },
  })
    .sort({ lastCheckedAt: 1 })
    .limit(5);
  for (const row of withdrawals) {
    try {
      await reconcileWithdrawal(row);
    } catch {
      pending++;
    } finally {
      await Withdrawal.updateOne(
        { _id: row._id },
        { lastCheckedAt: new Date() },
      );
    }
  }
  const subscriptions = await Subscription.find({
    mode,
    providerCode: { $type: "string" },
  })
    .sort({ lastCheckedAt: 1 })
    .limit(5);
  for (const row of subscriptions) {
    try {
      const remote = await paystack(
        `/subscription/${encodeURIComponent(row.providerCode)}`,
        undefined,
        mode,
      );
      const invoice = remote.most_recent_invoice;
      if (invoice?.paid && invoice.transaction) {
        const payment = await paystack(
          `/transaction/${encodeURIComponent(invoice.transaction?.id || invoice.transaction)}`,
          undefined,
          mode,
        );
        const key = `${mode}:reconcile:${invoice.invoice_code}`;
        const event = await WebhookEvent.findOneAndUpdate(
          { key },
          {
            $setOnInsert: {
              key,
              mode,
              type: "invoice.update",
              payload: {
                amount: invoice.amount,
                paid: true,
                period_start: invoice.period_start,
                period_end: invoice.period_end,
                subscription_code: row.providerCode,
                transaction: { reference: payment.reference },
              },
            },
          },
          { upsert: true, new: true },
        );
        await processEvent(event._id);
      }
    } catch {
      pending++;
    } finally {
      await Subscription.updateOne(
        { _id: row._id },
        { lastCheckedAt: new Date() },
      );
    }
  }
  return Response.json({ events: events.length, verified, pending });
}
