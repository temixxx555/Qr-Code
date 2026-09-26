import "server-only";
import crypto from "node:crypto";
import mongoose from "mongoose";
import {
  Workspace,
  Subscription,
  Order,
  Commission,
  AuditLog,
} from "@/app/models/Billing";
import {
  addMonths,
  percentage,
  assertVerifiedPayment,
} from "@/lib/billing-rules";
import { context, plans, settings, BillingError } from "./access";
import { paystack, secretKey } from "./paystack";
import { publicOrigin } from "@/app/lib/qr-service";

export async function transaction(callback) {
  // Indexes are also created by the explicit setup script before launch.
  await Promise.all(
    [Workspace, Subscription, Order, Commission, AuditLog].map((model) =>
      model.init(),
    ),
  );
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(() => callback(session));
  } finally {
    await session.endSession();
  }
}
export async function quote(workspace, mode, key, referralCode = "") {
  const plan = (await plans()).find((item) => item.key === key);
  if (!plan) throw new BillingError("Choose a valid billing period.");
  const policy = (await settings()).referral;
  const firstPayment = !(await Order.exists({
    workspaceId: workspace._id,
    mode,
    status: "paid",
  }));
  let referrer = null;
  if (firstPayment) {
    if (referralCode) {
      if (
        typeof referralCode !== "string" ||
        !/^[A-Z0-9]{6,32}$/i.test(referralCode)
      )
        throw new BillingError("Invalid referral code.");
      referrer = await Workspace.findOne({
        referralCode: referralCode.toUpperCase(),
        referralEnabled: true,
      });
      if (!referrer) throw new BillingError("Referral code is not available.");
    } else if (
      workspace.referredBy &&
      new Date(workspace.attributedAt).getTime() +
        policy.attributionDays * 86400000 >
        Date.now()
    ) {
      referrer = await Workspace.findOne({
        _id: workspace.referredBy,
        referralEnabled: true,
      });
    }
    if (
      referrer &&
      (String(referrer._id) === String(workspace._id) ||
        String(referrer.ownerId) === String(workspace.ownerId))
    )
      throw new BillingError("You cannot refer yourself.");
  }
  const discount = referrer ? percentage(plan.amount, policy.discountBps) : 0;
  return {
    plan,
    amount: plan.amount - discount,
    discount,
    firstPayment,
    referrerId: referrer?._id,
    referralPolicy: policy,
  };
}
export async function initializeCheckout(request, body) {
  const { user, workspace, subscription, mode } = await context();
  if (user.suspended || subscription?.status === "suspended")
    throw new BillingError("This account is suspended. Contact support.", 403);
  if ((await settings()).maintenance)
    throw new BillingError("Checkout is temporarily unavailable.", 503);
  secretKey(mode);
  const pricing = await quote(workspace, mode, body.plan, body.referralCode);
  if (body.recurring !== true && body.recurring !== false)
    throw new BillingError("Choose automatic or manual renewal.");
  const providerPlan =
    pricing.plan[`${mode}PlanCode`] ||
    process.env[
      `PAYSTACK_${mode.toUpperCase()}_PLAN_${pricing.plan.key.toUpperCase()}_V${pricing.plan.version}`
    ];
  if (body.recurring && !providerPlan)
    throw new BillingError(
      "Automatic renewal is not configured for this plan. Choose manual renewal.",
    );
  if (body.amount !== pricing.amount || body.version !== pricing.plan.version)
    throw new BillingError(
      "Your price has changed. Review the updated quote before paying.",
      409,
    );
  const origin = publicOrigin(request);
  const order = await transaction(async (session) => {
    await Workspace.updateOne(
      { _id: workspace._id },
      { $inc: { revision: 1 } },
      { session },
    );
    const current = await Subscription.findOne({
      workspaceId: workspace._id,
      mode,
    }).session(session);
    if (
      (current?.providerCode && current.renewalState !== "cancelled") ||
      current?.renewalState === "creating" ||
      current?.renewalState === "uncertain"
    )
      throw new BillingError(
        "Manage your existing automatic subscription before starting another checkout.",
        409,
      );
    if (new Date(current?.paidThrough) > new Date())
      throw new BillingError(
        "Your paid period is still active. You can renew when it expires.",
        409,
      );
    if (current?.providerCode)
      await Subscription.updateOne(
        { _id: current._id },
        {
          $addToSet: { priorProviderCodes: current.providerCode },
          $unset: { providerCode: 1, providerToken: 1 },
        },
        { session },
      );
    const pending = await Order.findOne({
      workspaceId: workspace._id,
      mode,
      status: "pending",
    }).session(session);
    if (pending) {
      if (
        pending.plan.key === pricing.plan.key &&
        pending.recurring === body.recurring &&
        pending.amount === pricing.amount &&
        String(pending.referrerId || "") === String(pricing.referrerId || "")
      )
        return pending;
      throw new BillingError(
        "A checkout is already pending. Verify or resolve it before starting another payment.",
        409,
      );
    }
    const [created] = await Order.create(
      [
        {
          ...pricing,
          workspaceId: workspace._id,
          userId: user._id,
          mode,
          email: user.email,
          plan: { ...JSON.parse(JSON.stringify(pricing.plan)), providerPlan },
          reference: `qr_${mode}_${crypto.randomBytes(16).toString("hex")}`,
          recurring: body.recurring,
          consentAt: body.recurring ? new Date() : null,
          expiresAt: new Date(Date.now() + 30 * 60000),
        },
      ],
      { session },
    );
    return created;
  });
  if (order.checkoutUrl)
    return { url: order.checkoutUrl, reference: order.reference };
  // Never attach a plan to the discounted first transaction: Paystack would override the amount.
  const result = await paystack(
    "/transaction/initialize",
    {
      email: order.email,
      amount: order.amount,
      currency: "NGN",
      reference: order.reference,
      callback_url: `${origin}/dashboard/billing?reference=${encodeURIComponent(order.reference)}`,
      ...(order.recurring ? { channels: ["card"] } : {}),
      metadata: { orderId: String(order._id) },
    },
    mode,
  );
  if (
    result.reference !== order.reference ||
    new URL(result.authorization_url).hostname !== "checkout.paystack.com"
  )
    throw new Error("Unexpected checkout response");
  await Order.updateOne(
    { _id: order._id, status: "pending" },
    { checkoutUrl: result.authorization_url },
  );
  return { url: result.authorization_url, reference: order.reference };
}
export async function fulfill(reference, mode, ownerId) {
  const order = await Order.findOne({
    reference,
    mode,
    ...(ownerId ? { userId: ownerId } : {}),
  });
  if (!order) throw new BillingError("Payment reference not found.", 404);
  const payment = await paystack(
    `/transaction/verify/${encodeURIComponent(reference)}`,
    undefined,
    mode,
  );
  if (payment.status === "failed" && order.status === "pending") {
    await Order.updateOne({ _id: order._id, status: "pending" }, { status: "failed" });
    throw new BillingError("Paystack confirmed this payment failed. You can start a new checkout.", 409);
  }
  if (payment.status !== "success")
    throw new BillingError(
      "Payment is not confirmed yet. You can check again shortly.",
      409,
    );
  assertVerifiedPayment(order, payment);
  await transaction(async (session) => {
    await Workspace.updateOne(
      { _id: order.workspaceId },
      { $inc: { revision: 1 } },
      { session },
    );
    const current = await Order.findById(order._id).session(session);
    if (current.status === "paid") return;
    const firstSuccessfulPayment = !(await Order.exists({ workspaceId: order.workspaceId, mode, status: "paid" }).session(session));
    const subscription = await Subscription.findOne({
      workspaceId: order.workspaceId,
      mode,
    }).session(session);
    const paidAt = new Date(payment.paid_at);
    const start = order.providerPeriod
      ? order.periodStart
      : new Date(
          Math.max(
            paidAt.getTime(),
            new Date(subscription?.paidThrough || 0).getTime(),
          ),
        );
    const end = order.providerPeriod
      ? order.periodEnd
      : addMonths(start, order.plan.months);
    current.set({
      status: "paid",
      paidAt,
      periodStart: start,
      periodEnd: end,
      providerId: String(payment.id),
      providerCustomer: payment.customer.customer_code,
      authorizationCode: payment.authorization?.authorization_code,
      authorizationReusable: payment.authorization?.reusable === true,
      authorizationChannel: payment.authorization?.channel,
    });
    await current.save({ session });
    await Subscription.findOneAndUpdate(
      { workspaceId: order.workspaceId, mode },
      {
        $max: { paidThrough: end },
        $set: {
          plan: order.plan,
          status: subscription?.status === "suspended" ? "suspended" : "active",
          cancelAtPeriodEnd: order.providerPeriod
            ? Boolean(subscription?.cancelAtPeriodEnd)
            : false,
          providerCustomer: payment.customer.customer_code,
          ...(order.recurring
            ? { renewalState: "pending", renewalOrder: order._id }
            : {}),
        },
      },
      { upsert: true, session },
    );
    if (order.referrerId && ((order.firstPayment && firstSuccessfulPayment) || (!order.firstPayment && order.referralPolicy.renewalCommissions))) {
      await Commission.create(
        [
          {
            workspaceId: order.referrerId,
            orderId: order._id,
            mode,
            amount: percentage(
              order.amount,
              order.referralPolicy.commissionBps,
            ),
            availableAt: new Date(
              paidAt.getTime() + order.referralPolicy.holdDays * 86400000,
            ),
          },
        ],
        { session },
      );
    }
  });
  if (order.recurring) await scheduleRenewal(order._id, mode);
  return Order.findById(order._id).lean();
}
export async function scheduleRenewal(orderId, mode) {
  const order = await Order.findById(orderId).select("+authorizationCode");
  if (
    !order ||
    order.status !== "paid" ||
    !order.recurring ||
    !order.plan.providerPlan
  )
    return;
  if (
    !order.authorizationReusable ||
    !["card", "direct_debit"].includes(order.authorizationChannel)
  ) {
    await Subscription.updateOne(
      { renewalOrder: orderId, mode, renewalState: "pending" },
      { renewalState: "manual" },
    );
    return;
  }
  const claimed = await Subscription.findOneAndUpdate(
    {
      renewalOrder: orderId,
      mode,
      renewalState: "pending",
      providerCode: { $exists: false },
      cancelAtPeriodEnd: false,
    },
    { renewalState: "creating" },
    { new: true },
  );
  if (!claimed) return;
  try {
    const providerPlan = await paystack(
      `/plan/${encodeURIComponent(order.plan.providerPlan)}`,
      undefined,
      mode,
    );
    if (
      providerPlan.amount !== order.plan.amount ||
      providerPlan.currency !== "NGN" ||
      providerPlan.interval !== order.plan.interval
    ) {
      await Subscription.updateOne(
        { _id: claimed._id },
        { renewalState: "configuration_error" },
      );
      return;
    }
    const result = await paystack(
      "/subscription",
      {
        customer: order.providerCustomer,
        plan: order.plan.providerPlan,
        authorization: order.authorizationCode,
        start_date: order.periodEnd.toISOString(),
      },
      mode,
    );
    await Subscription.updateOne(
      { _id: claimed._id, renewalState: "creating", cancelAtPeriodEnd: false },
      {
        providerCode: result.subscription_code,
        providerToken: result.email_token,
        renewalState: "enabled",
      },
    );
  } catch {
    // An uncertain response may have created a real subscription. Do not blindly retry.
    await Subscription.updateOne(
      { _id: claimed._id, renewalState: "creating" },
      { renewalState: "uncertain" },
    );
  }
}
export async function cancelRenewal(workspaceId, mode) {
  const row = await Subscription.findOne({ workspaceId, mode }).select(
    "+providerToken",
  );
  if (!row) throw new BillingError("No subscription found.", 404);
  if (["creating", "uncertain"].includes(row.renewalState))
    throw new BillingError(
      "Automatic renewal setup needs reconciliation. Contact support to cancel safely.",
      409,
    );
  if (row.providerCode)
    await paystack(
      "/subscription/disable",
      { code: row.providerCode, token: row.providerToken },
      mode,
    );
  await Subscription.updateOne(
    { _id: row._id },
    { cancelAtPeriodEnd: true, renewalState: "cancelled" },
  );
}
