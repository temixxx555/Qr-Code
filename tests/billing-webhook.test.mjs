import test, { mock } from "node:test";
import assert from "node:assert/strict";

let event, scheduled, fulfillCalls, signatureValid;
function query(value) {
  return {
    select() {
      return this;
    },
    then(resolve, reject) {
      return Promise.resolve(value).then(resolve, reject);
    },
  };
}
const WebhookEvent = {
  async init() {},
  async create(values) {
    event = { _id: "event1", ...values };
    return event;
  },
  async findOne() {
    return event;
  },
  findOneAndUpdate() {
    return query(event);
  },
  async updateOne(_filter, update) {
    Object.assign(event, update.$set);
  },
};

mock.module(new URL("../node_modules/next/server.js", import.meta.url), {
  namedExports: {
    after(callback) {
      scheduled = callback;
    },
  },
});
mock.module(new URL("../app/lib/mongodb.js", import.meta.url), {
  namedExports: { connectDB: async () => {} },
});
mock.module(new URL("../app/lib/billing/paystack.js", import.meta.url), {
  namedExports: {
    billingMode: () => "test",
    validSignature: () => signatureValid,
    paystack: async () => ({}),
  },
});
mock.module(new URL("../app/models/Billing.js", import.meta.url), {
  namedExports: {
    WebhookEvent,
    Order: { exists: async () => true },
    Subscription: {},
    Workspace: {},
    Commission: {},
    RefundRecord: {},
    Withdrawal: {},
  },
});
mock.module(new URL("../app/lib/billing/service.js", import.meta.url), {
  namedExports: {
    async fulfill(reference, mode) {
      fulfillCalls.push({ reference, mode });
    },
    transaction: async (callback) => callback(),
  },
});
const { POST } = await import("../app/api/billing/webhook/route.js");

function reset() {
  event = null;
  scheduled = null;
  fulfillCalls = [];
  signatureValid = true;
}

function request() {
  return new Request("https://example.invalid/api/billing/webhook", {
    method: "POST",
    headers: { "x-paystack-signature": "fixture-signature" },
    body: JSON.stringify({
      event: "charge.success",
      data: { domain: "test", reference: "qr_test_fixture" },
    }),
  });
}

test("signed Paystack success webhook is persisted, acknowledged, then processed", async () => {
  reset();
  const response = await POST(request());

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Received");
  assert.equal(event.type, "charge.success");
  assert.equal(event.mode, "test");
  assert.equal(event.payload.reference, "qr_test_fixture");
  assert.equal(event.payload.domain, "test");
  assert.equal(typeof scheduled, "function");

  await scheduled();
  assert.deepEqual(fulfillCalls, [
    { reference: "qr_test_fixture", mode: "test" },
  ]);
  assert.equal(event.status, "processed");
});

test("invalid webhook signature is rejected before persisting or scheduling", async () => {
  reset();
  signatureValid = false;

  const response = await POST(request());

  assert.equal(response.status, 401);
  assert.equal(event, null);
  assert.equal(scheduled, null);
  assert.deepEqual(fulfillCalls, []);
});
