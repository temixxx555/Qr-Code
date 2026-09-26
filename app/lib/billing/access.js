import "server-only";
import crypto from "node:crypto";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import User from "@/app/models/User";
import {
  Workspace,
  Subscription,
  BillingSettings,
  PlanVersion,
} from "@/app/models/Billing";
import {
  PLANS,
  REFERRAL_DEFAULTS,
  hasPremium,
  subscriptionState,
} from "@/lib/billing-rules";
import { billingMode } from "./paystack";
export class BillingError extends Error {
  constructor(message, status = 400, code = "BILLING_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export function billingError(error) {
  return Response.json(
    {
      message:
        error instanceof BillingError
          ? error.message
          : "The billing operation could not be completed. Please try again or contact support.",
      code: error.code || "BILLING_ERROR",
    },
    { status: error.status || 503 },
  );
}
export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    throw new BillingError("Invalid request origin.", 403);
}
export async function billingUser() {
  const auth = await getAuthenticatedUser();
  if (!auth) throw new BillingError("Sign in to continue.", 401);
  await connectDB();
  const user = await User.findById(auth.userId);
  if (!user) throw new BillingError("Account not found.", 401);
  return user;
}
export async function workspaceFor(user) {
  let workspace = await Workspace.findOne({ ownerId: user._id });
  if (!workspace) {
    try {
      workspace = await Workspace.create({
        ownerId: user._id,
        name: user.name,
        referralCode: crypto.randomBytes(6).toString("hex").toUpperCase(),
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      workspace = await Workspace.findOne({ ownerId: user._id });
    }
  }
  return workspace;
}
export async function settings() {
  const row = await BillingSettings.findById("global").lean();
  return {
    maintenance: row?.maintenance || false,
    referral: { ...REFERRAL_DEFAULTS, ...row?.referral },
  };
}
export async function plans() {
  const rows = await PlanVersion.find({
    published: true,
    effectiveAt: { $lte: new Date() },
  })
    .sort({ version: -1 })
    .lean();
  return PLANS.map((base) => rows.find((row) => row.key === base.key) || base);
}
export async function context() {
  const user = await billingUser();
  const workspace = await workspaceFor(user);
  const mode = billingMode();
  const subscription = await Subscription.findOne({
    workspaceId: workspace._id,
    mode,
  });
  const premium =
    !user.suspended &&
    subscription?.status !== "suspended" &&
    (hasPremium(subscription) ||
      new Date(subscription?.complimentaryThrough) > new Date());
  return {
    user,
    workspace,
    subscription,
    premium,
    mode,
    state: user.suspended ? "suspended" : premium && !hasPremium(subscription) ? "complimentary" : subscriptionState(subscription),
  };
}
export async function premiumGate(userId) {
  await connectDB();
  const user = await User.findById(userId).select("suspended");
  const workspace = await Workspace.findOne({ ownerId: userId });
  const subscription =
    workspace &&
    (await Subscription.findOne({
      workspaceId: workspace._id,
      mode: billingMode(),
    }));
  if (
    user &&
    !user.suspended &&
    subscription?.status !== "suspended" &&
    (hasPremium(subscription) ||
      new Date(subscription?.complimentaryThrough) > new Date())
  )
    return null;
  return Response.json(
    {
      code: "UPGRADE_REQUIRED",
      message: "Premium is required for this feature.",
      upgradeUrl: "/dashboard/billing",
    },
    { status: 403 },
  );
}
export async function requireAdmin(
  roles = ["superadmin", "finance", "support", "analyst"],
) {
  const user = await billingUser();
  if (user.suspended || !roles.includes(user.adminRole))
    throw new BillingError("Administrator access required.", 403);
  return user;
}
