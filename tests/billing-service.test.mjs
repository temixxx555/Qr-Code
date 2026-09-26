import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { PLANS } from "../lib/billing-rules.js";
// Exercise the actual service using isolated repositories. Never loads .env or contacts Mongo/Paystack.
let db, providerCalls, rejectSubscription;
const clone = (v) => structuredClone(v);
function match(row, filter) {
  return (
    row &&
    Object.entries(filter).every(([key, value]) => {
      if (value && typeof value === "object" && !(value instanceof Date)) {
        if ("$exists" in value)
          return (row[key] !== undefined) === value.$exists;
        if ("$in" in value) return value.$in.includes(row[key]);
      }
      return String(row[key]) === String(value);
    })
  );
}
function update(row, values) {
  for (const [key, value] of Object.entries(values.$set || values))
    if (!key.startsWith("$")) row[key] = value;
  for (const [key, value] of Object.entries(values.$max || {}))
    if (!row[key] || new Date(value) > new Date(row[key])) row[key] = value;
}
function query(fn) {
  return {
    then(resolve, reject) {
      return Promise.resolve().then(fn).then(resolve, reject);
    },
    session() {
      return this;
    },
    select() {
      return this;
    },
    sort() {
      return this;
    },
    lean() {
      return this;
    },
  };
}
function document(row) {
  return (
    row &&
    Object.assign(row, {
      set(values) {
        Object.assign(this, values);
      },
      async save() {
        return this;
      },
    })
  );
}
const base = { async init() {} };
const Order = {
  ...base,
  exists: (filter) => query(() => db.orders.some((row) => match(row, filter))),
  updateOne: async (filter, values) => { const row = db.orders.find((row) => match(row, filter)); if (row) update(row, values); },
  findOne: (filter) =>
    query(() => document(db.orders.find((row) => match(row, filter)))),
  findById: (id) =>
    query(() => document(db.orders.find((row) => row._id === id))),
};
const Subscription = {
  ...base,
  findOne: (filter) =>
    query(() => db.subscriptions.find((row) => match(row, filter))),
  findOneAndUpdate: (filter, values, options = {}) =>
    query(() => {
      let row = db.subscriptions.find((row) => match(row, filter));
      if (!row && options.upsert) {
        row = { ...filter, _id: "subscription1" };
        db.subscriptions.push(row);
      }
      if (row) update(row, values);
      return row;
    }),
  updateOne: async (filter, values) => {
    const row = db.subscriptions.find((row) => match(row, filter));
    if (row) update(row, values);
  },
};
let queue = Promise.resolve();
mock.module("mongoose", {
  defaultExport: {
    startSession: async () => ({
      withTransaction(callback) {
        const result = queue.then(callback);
        queue = result.catch(() => {});
        return result;
      },
      async endSession() {},
    }),
  },
});
mock.module(new URL("../app/models/Billing.js", import.meta.url), {
  namedExports: {
    Order,
    Subscription,
    Workspace: { ...base, async updateOne() {} },
    Commission: {
      ...base,
      async create(rows) {
        for (const row of rows) {
          assert.ok(
            !db.commissions.some((entry) => entry.orderId === row.orderId),
          );
          db.commissions.push(row);
        }
      },
    },
    AuditLog: base,
  },
});
class BillingError extends Error {}
mock.module(new URL("../app/lib/billing/access.js", import.meta.url), {
  namedExports: {
    context: async () => ({}),
    plans: async () => PLANS,
    settings: async () => ({}),
    BillingError,
  },
});
mock.module(new URL("../app/lib/qr-service.js", import.meta.url), {
  namedExports: { publicOrigin: () => "https://example.invalid" },
});
mock.module(new URL("../app/lib/billing/paystack.js", import.meta.url), {
  namedExports: {
    secretKey: () => "fixture",
    paystack: async (path, body) => {
      providerCalls.push({ path, body });
      if (path.startsWith("/transaction/verify/")) return clone(db.payment);
      if (path.startsWith("/plan/"))
        return { amount: 300000, currency: "NGN", interval: "monthly" };
      if (path === "/subscription") {
        if (rejectSubscription)
          throw new Error("timeout after provider may have accepted request");
        return { subscription_code: "SUB_test", email_token: "token" };
      }
      if (path === "/subscription/disable") return {};
      throw new Error(`Unexpected external operation: ${path}`);
    },
  },
});
const { fulfill, scheduleRenewal, cancelRenewal } =
  await import("../app/lib/billing/service.js");
function reset(recurring = false) {
  queue = Promise.resolve();
  providerCalls = [];
  rejectSubscription = false;
  db = {
    orders: [
      {
        _id: "order1",
        workspaceId: "buyer",
        userId: "user1",
        reference: "qr_test_fixture",
        mode: "test",
        email: "fixture@example.invalid",
        status: "pending",
        amount: 285000,
        plan: { ...PLANS[0], providerPlan: "PLN_fixture" },
        firstPayment: true,
        recurring,
        referrerId: "referrer",
        referralPolicy: { commissionBps: 1000, holdDays: 14 },
      },
    ],
    subscriptions: [],
    commissions: [],
    payment: {
      id: 123,
      reference: "qr_test_fixture",
      amount: 285000,
      status: "success",
      domain: "test",
      currency: "NGN",
      paid_at: "2026-01-31T12:00:00Z",
      customer: {
        email: "fixture@example.invalid",
        customer_code: "CUS_fixture",
      },
      authorization: {
        reusable: true,
        channel: "card",
        authorization_code: "AUTH_fixture",
      },
    },
  };
}
test("concurrent callback and webhook grant one period and one commission", async () => {
  reset();
  await Promise.all([
    fulfill("qr_test_fixture", "test", "user1"),
    fulfill("qr_test_fixture", "test"),
    fulfill("qr_test_fixture", "test"),
  ]);
  assert.equal(db.subscriptions.length, 1);
  assert.equal(
    db.subscriptions[0].paidThrough.toISOString(),
    "2026-02-28T12:00:00.000Z",
  );
  assert.equal(db.commissions.length, 1);
  assert.equal(db.commissions[0].amount, 28500);
});
test("foreign owner or payment environment cannot verify another order", async () => {
  reset();
  await assert.rejects(fulfill("qr_test_fixture", "test", "attacker"));
  await assert.rejects(fulfill("qr_test_fixture", "live", "user1"));
  assert.equal(providerCalls.length, 0);
  assert.equal(db.subscriptions.length, 0);
});
test("a forged successful callback cannot bypass provider verification", async () => {
  reset();
  db.payment.amount = 1;
  await assert.rejects(fulfill("qr_test_fixture", "test", "user1"));
  assert.equal(db.subscriptions.length, 0);
  assert.equal(db.commissions.length, 0);
});
test("discounted first payment schedules full-price renewal once at period end", async () => {
  reset(true);
  await fulfill("qr_test_fixture", "test");
  await fulfill("qr_test_fixture", "test");
  const calls = providerCalls.filter((call) => call.path === "/subscription");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.start_date, "2026-02-28T12:00:00.000Z");
  assert.equal(calls[0].body.plan, "PLN_fixture");
  assert.equal(db.orders[0].amount, 285000);
  assert.equal(db.subscriptions[0].renewalState, "enabled");
});
test("ambiguous subscription creation preserves paid access and never retries creation blindly", async () => {
  reset(true);
  rejectSubscription = true;
  await fulfill("qr_test_fixture", "test");
  await scheduleRenewal("order1", "test");
  assert.equal(db.orders[0].status, "paid");
  assert.equal(db.subscriptions[0].renewalState, "uncertain");
  assert.equal(
    providerCalls.filter((call) => call.path === "/subscription").length,
    1,
  );
});
test("cancellation does not truncate paid access or erase commission", async () => {
  reset(true);
  await fulfill("qr_test_fixture", "test");
  const through = db.subscriptions[0].paidThrough.toISOString();
  await cancelRenewal("buyer", "test");
  assert.equal(db.subscriptions[0].paidThrough.toISOString(), through);
  assert.equal(db.subscriptions[0].cancelAtPeriodEnd, true);
  assert.equal(db.commissions.length, 1);
});
test("late renewal invoice uses its own period and never moves paidThrough backwards", async () => {
  reset();
  db.orders[0].providerPeriod = true;
  db.orders[0].periodStart = new Date("2026-01-01");
  db.orders[0].periodEnd = new Date("2026-02-01");
  db.subscriptions.push({
    _id: "subscription1",
    workspaceId: "buyer",
    mode: "test",
    status: "active",
    paidThrough: new Date("2026-04-01"),
  });
  await fulfill("qr_test_fixture", "test");
  assert.equal(
    db.subscriptions[0].paidThrough.toISOString(),
    "2026-04-01T00:00:00.000Z",
  );
});
