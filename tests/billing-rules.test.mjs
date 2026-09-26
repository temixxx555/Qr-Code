import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import mongoose from "mongoose";
import {
  PLANS,
  percentage,
  addMonths,
  hasPremium,
  subscriptionState,
  assertVerifiedPayment,
  refundCommission,
} from "../lib/billing-rules.js";
import { verifyWebhookSignature } from "../lib/billing-security.js";
import {
  Order,
  Subscription,
  Commission,
  Workspace,
} from "../app/models/Billing.js";

test("all requested Nigerian prices are exact integer kobo", () => {
  assert.deepEqual(
    PLANS.map((p) => [p.months, p.amount]),
    [
      [1, 300000],
      [3, 800000],
      [6, 1600000],
      [12, 2900000],
    ],
  );
});
test("first-payment discount and commission use the discounted amount", () => {
  const discounted = 300000 - percentage(300000, 500);
  assert.equal(discounted, 285000);
  assert.equal(percentage(discounted, 1000), 28500);
  assert.equal(percentage(101, 500), 5);
  assert.throws(() => percentage(2.4, 10));
});
test("calendar billing clamps month-end and leap-day correctly", () => {
  assert.equal(
    addMonths("2028-01-31T10:00:00Z", 1).toISOString(),
    "2028-02-29T10:00:00.000Z",
  );
  assert.equal(
    addMonths("2028-02-29T10:00:00Z", 12).toISOString(),
    "2029-02-28T10:00:00.000Z",
  );
  assert.equal(
    addMonths("2026-08-31T10:00:00Z", 6).toISOString(),
    "2027-02-28T10:00:00.000Z",
  );
});
test("access follows paidThrough, not an active flag; cancellation and failed renewal retain paid access", () => {
  const now = new Date("2026-09-18T00:00:00Z");
  assert.equal(hasPremium({ status: "active" }, now), false);
  assert.equal(
    hasPremium({ status: "active", paidThrough: "2026-09-17" }, now),
    false,
  );
  assert.equal(
    hasPremium({ status: "past_due", paidThrough: "2026-09-19" }, now),
    true,
  );
  assert.equal(
    hasPremium({ status: "suspended", paidThrough: "2027-01-01" }, now),
    false,
  );
  assert.equal(
    subscriptionState(
      { paidThrough: "2026-09-19", cancelAtPeriodEnd: true },
      now,
    ),
    "cancel_at_period_end",
  );
  assert.equal(
    subscriptionState({ status: "active", paidThrough: "2026-09-18" }, now),
    "expired",
  );
});
const order = {
  reference: "qr_test_123",
  amount: 285000,
  mode: "test",
  email: "buyer@example.invalid",
};
const payment = {
  id: 1,
  status: "success",
  reference: order.reference,
  amount: order.amount,
  currency: "NGN",
  domain: "test",
  customer: { email: order.email },
  paid_at: "2026-09-18T10:00:00Z",
};
test("server verification accepts only the matching successful payment", () =>
  assert.doesNotThrow(() => assertVerifiedPayment(order, payment)));
for (const [field, value] of [
  ["status", "pending"],
  ["amount", 1],
  ["currency", "USD"],
  ["reference", "other"],
  ["domain", "live"],
  ["paid_at", "garbage"],
  ["customer", { email: "other@example.invalid" }],
])
  test(`verification rejects mismatched ${field}`, () =>
    assert.throws(() =>
      assertVerifiedPayment(order, { ...payment, [field]: value }),
    ));
test("webhook authentication signs raw bytes and rejects forged or altered bodies", () => {
  const secret = "sk_test_fixture_only",
    raw = '{"event":"charge.success"}';
  const signature = crypto
    .createHmac("sha512", secret)
    .update(raw)
    .digest("hex");
  assert.equal(verifyWebhookSignature(raw, signature, secret), true);
  assert.equal(verifyWebhookSignature(raw + " ", signature, secret), false);
  assert.equal(verifyWebhookSignature(raw, "a", secret), false);
  assert.equal(verifyWebhookSignature(raw, signature, "another-secret"), false);
});
test("partial refunds reverse proportional commissions without rounding drift", () => {
  assert.equal(refundCommission(28500, 285000, 142500), 14250);
  assert.equal(refundCommission(28500, 285000, 285000), 28500);
  assert.throws(() => refundCommission(28500, 285000, 285001));
});
test("database constraints protect payment and commission idempotency", () => {
  assert.ok(
    Order.schema
      .indexes()
      .some(([fields, options]) => fields.reference && options.unique),
  );
  assert.ok(
    Order.schema
      .indexes()
      .some(
        ([fields, options]) =>
          fields.providerId && fields.mode && options.unique,
      ),
  );
  assert.ok(
    Commission.schema
      .indexes()
      .some(([fields, options]) => fields.orderId && options.unique),
  );
  assert.ok(
    Subscription.schema
      .indexes()
      .some(
        ([fields, options]) =>
          fields.workspaceId && fields.mode && options.unique,
      ),
  );
});
test("Personal and Business do not grant premium or administrator rights", () => {
  const workspace = new Workspace({
    ownerId: new mongoose.Types.ObjectId(),
    type: "business",
    referralCode: "TESTCODE",
  });
  assert.equal(workspace.validateSync(), undefined);
  assert.equal(workspace.adminRole, undefined);
  assert.equal(workspace.premium, undefined);
});
