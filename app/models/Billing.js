import mongoose from "mongoose";
const { Schema } = mongoose;
const id = { type: Schema.Types.ObjectId, required: true, index: true };
const mode = { type: String, enum: ["test", "live"], required: true };
const integer = { type: Number, min: 0, validate: Number.isSafeInteger };
function model(name, fields, indexes = []) {
  const schema = new Schema(fields, { timestamps: true });
  for (const [keys, options] of indexes) schema.index(keys, options);
  return mongoose.models[name] || mongoose.model(name, schema);
}
export const Workspace = model("Workspace", {
  ownerId: { ...id, unique: true },
  type: { type: String, enum: ["personal", "business"], default: "personal" },
  name: { type: String, maxlength: 120 },
  logo: String,
  contactEmail: String,
  billingAddress: { type: String, maxlength: 1000 },
  referralCode: { type: String, unique: true, required: true },
  referralEnabled: { type: Boolean, default: true },
  referredBy: Schema.Types.ObjectId,
  attributedAt: Date,
  seatLimit: { type: Number, default: 1 },
  revision: { type: Number, default: 0 },
});
export const PlanVersion = model(
  "PlanVersion",
  {
    key: String,
    version: Number,
    label: String,
    months: Number,
    interval: String,
    amount: integer,
    effectiveAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
    testPlanCode: String,
    livePlanCode: String,
  },
  [[{ key: 1, version: 1 }, { unique: true }]],
);
export const Subscription = model(
  "BillingSubscription",
  {
    workspaceId: id,
    mode,
    status: { type: String, default: "free" },
    paidThrough: Date,
    plan: Schema.Types.Mixed,
    cancelAtPeriodEnd: { type: Boolean, default: false },
    providerCode: String,
    providerCustomer: String,
    providerToken: { type: String, select: false },
    priorProviderCodes: [String],
    renewalState: { type: String, default: "manual" },
    renewalOrder: Schema.Types.ObjectId,
    complimentaryThrough: Date,
    lastCheckedAt: Date,
  },
  [
    [{ workspaceId: 1, mode: 1 }, { unique: true }],
    [{ mode: 1, providerCode: 1 }, { sparse: true }],
  ],
);
export const Order = model(
  "BillingOrder",
  {
    workspaceId: id,
    userId: id,
    mode,
    reference: { type: String, required: true, unique: true },
    email: String,
    plan: Schema.Types.Mixed,
    amount: integer,
    discount: integer,
    currency: { type: String, default: "NGN" },
    status: { type: String, default: "pending" },
    checkoutUrl: String,
    expiresAt: Date,
    recurring: Boolean,
    consentAt: Date,
    referrerId: Schema.Types.ObjectId,
    referralPolicy: Schema.Types.Mixed,
    firstPayment: Boolean,
    paidAt: Date,
    periodStart: Date,
    periodEnd: Date,
    providerPeriod: Boolean,
    lastCheckedAt: Date,
    providerId: String,
    providerCustomer: String,
    authorizationCode: { type: String, select: false },
    authorizationReusable: Boolean,
    authorizationChannel: String,
    refundedAmount: { ...integer, default: 0 },
    disputed: { type: Boolean, default: false },
  },
  [
    [
      { mode: 1, providerId: 1 },
      {
        unique: true,
        partialFilterExpression: { providerId: { $type: "string" } },
      },
    ],
  ],
);
export const WebhookEvent = model("BillingWebhookEvent", {
  key: { type: String, unique: true },
  mode,
  type: String,
  payload: { type: Schema.Types.Mixed, select: false },
  status: { type: String, default: "pending" },
  attempts: { type: Number, default: 0 },
  error: String,
  processedAt: Date,
  leaseUntil: Date,
});
export const Commission = model("ReferralCommission", {
  workspaceId: id,
  orderId: { ...id, unique: true },
  mode,
  amount: integer,
  reversedAmount: { ...integer, default: 0 },
  availableAt: Date,
  state: {
    type: String,
    enum: ["pending", "available", "reserved", "paid", "reversed"],
    default: "pending",
  },
  withdrawalId: Schema.Types.ObjectId,
  onHold: { type: Boolean, default: false },
});
export const Withdrawal = model("AffiliateWithdrawal", {
  workspaceId: id,
  mode,
  amount: integer,
  state: { type: String, default: "requested" },
  reference: { type: String, unique: true },
  recipientCode: { type: String, select: false },
  bankLabel: String,
  reason: String,
  providerCode: String,
  approvedBy: Schema.Types.ObjectId,
  recoveryAmount: { ...integer, default: 0 },
  lastCheckedAt: Date,
});
export const BillingSettings = model("BillingSettings", {
  _id: { type: String, default: "global" },
  referral: Schema.Types.Mixed,
  maintenance: { type: Boolean, default: false },
});
export const AuditLog = model("BillingAuditLog", {
  actorId: id,
  action: String,
  resource: String,
  reason: String,
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
});
export const RefundRecord = model(
  "BillingRefund",
  { providerId: String, mode, orderId: id, amount: integer },
  [[{ mode: 1, providerId: 1 }, { unique: true }]],
);
export const BankRecipient = model(
  "BillingBankRecipient",
  {
    workspaceId: id,
    mode,
    recipientCode: { type: String, select: false },
    label: String,
  },
  [[{ workspaceId: 1, mode: 1 }, { unique: true }]],
);
