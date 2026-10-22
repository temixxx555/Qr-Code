export const PLANS = Object.freeze([
  {
    key: "monthly",
    label: "Monthly",
    months: 1,
    amount: 300000,
    interval: "monthly",
    version: 1,
  },
  // {
  //   key: "quarterly",
  //   label: "Quarterly",
  //   months: 3,
  //   amount: 800000,
  //   interval: "quarterly",
  //   version: 1,
  // },
  {
    key: "biannual",
    label: "Every three months",
    months: 3,
    amount: 850000,
    interval: "quarterly",
    version: 1,
  },
  {
    key: "annual",
    label: "Yearly",
    months: 12,
    amount: 2900000,
    interval: "annually",
    version: 1,
  },
]);
export const REFERRAL_DEFAULTS = Object.freeze({
  discountBps: 500,
  commissionBps: 1000,
  holdDays: 14,
  attributionDays: 30,
  renewalCommissions: false,
  minimumWithdrawal: 500000,
});
// Nigerian VAT (7.5%) in basis points. Administrators can change the rate.
export const VAT_DEFAULT_BPS = 750;
export const vatLabel = (bps) => `${(bps / 100).toLocaleString("en-NG")}% VAT`;
export function withVat(subtotal, vatBps) {
  const vat = percentage(subtotal, vatBps);
  return { subtotal, vat, total: subtotal + vat };
}
// What a plan snapshot charges each period. Plans saved before VAT have no rate.
export const planCharge = (plan) => withVat(plan.amount, plan.vatBps || 0);
export const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount / 100);
export function percentage(amount, bps) {
  if (
    !Number.isSafeInteger(amount) ||
    amount < 0 ||
    !Number.isInteger(bps) ||
    bps < 0 ||
    bps > 10000
  )
    throw new Error("Invalid monetary calculation");
  return Number((BigInt(amount) * BigInt(bps) + 5000n) / 10000n);
}
export function addMonths(date, months) {
  const result = new Date(date);
  if (
    !Number.isFinite(result.getTime()) ||
    !Number.isInteger(months) ||
    months < 1 ||
    months > 12
  )
    throw new Error("Invalid billing period");
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, last));
  return result;
}
export function providerPlanCode(plan, mode, env = process.env) {
  const code =
    plan[`${mode}PlanCode`] ||
    env[`PAYSTACK_${mode.toUpperCase()}_PLAN_${plan.key.toUpperCase()}_V${plan.version}`];
  return /^PLN_[a-z0-9]+$/i.test(code || "") ? code : null;
}
export function hasPremium(subscription, now = new Date()) {
  return Boolean(
    subscription &&
    subscription.status !== "suspended" &&
    new Date(subscription.paidThrough) > now,
  );
}
export function isAdministrator(user) {
  return ["superadmin", "finance", "support", "analyst"].includes(
    user?.adminRole,
  );
}
export function hasServiceAccess(user, subscription, now = new Date()) {
  if (!user || user.suspended) return false;
  if (isAdministrator(user)) return true;
  return (
    subscription?.status !== "suspended" &&
    (hasPremium(subscription, now) ||
      new Date(subscription?.complimentaryThrough) > now)
  );
}
export function subscriptionState(subscription, now = new Date()) {
  if (!subscription) return "free";
  if (subscription.status === "suspended") return "suspended";
  if (hasPremium(subscription, now))
    return subscription.cancelAtPeriodEnd
      ? "cancel_at_period_end"
      : subscription.status === "past_due"
        ? "past_due"
        : "active";
  return subscription.paidThrough ? "expired" : "free";
}
export function assertVerifiedPayment(order, payment) {
  if (
    payment.status !== "success" ||
    payment.reference !== order.reference ||
    payment.currency !== "NGN" ||
    // When fees are passed to the customer, Paystack's amount includes them and
    // requested_amount holds the amount we initialized the checkout with.
    (payment.requested_amount ?? payment.amount) !== order.amount ||
    !(payment.amount >= order.amount) ||
    payment.domain !== order.mode ||
    payment.customer?.email?.toLowerCase() !== order.email.toLowerCase() ||
    !payment.id ||
    !Number.isFinite(new Date(payment.paid_at).getTime())
  )
    throw new Error("Payment verification did not match this order.");
}
export function refundCommission(
  originalCommission,
  originalAmount,
  totalRefunded,
) {
  if (
    !Number.isSafeInteger(totalRefunded) ||
    totalRefunded < 0 ||
    totalRefunded > originalAmount
  )
    throw new Error("Invalid refund amount");
  return Number(
    (BigInt(originalCommission) * BigInt(totalRefunded) +
      BigInt(Math.floor(originalAmount / 2))) /
      BigInt(originalAmount),
  );
}
