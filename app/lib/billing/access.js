import "server-only";
import crypto from "node:crypto";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { publicOrigin } from "@/app/lib/qr-service";
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
  VAT_DEFAULT_BPS,
  hasPremium,
  hasServiceAccess,
  isAdministrator,
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
  console.error("BILLING ERROR:", {
    name: error?.name,
    message: error?.message,
    code: error?.code,
    status: error?.status,
    stack: error?.stack,
  });

  return Response.json(
    {
      message:
        error instanceof BillingError
          ? error.message
          : "The billing operation could not be completed. Please try again or contact support.",
      code: error?.code || "BILLING_ERROR",
    },
    { status: error?.status || 503 },
  );
}
export function sameOrigin(request) {
  // Safe methods don't change state, so no origin check is needed.
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;

  let origin = request.headers.get("origin");

  // Some same-origin requests send only a Referer header.
  if (!origin) {
    try {
      origin = new URL(request.headers.get("referer") || "").origin;
    } catch {}
  }

  let originHost = null;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {}

  // Accept the configured public domain and the host the browser addressed.
  // Behind Hostinger's proxy request.url is the internal bind address, so the
  // public host comes from X-Forwarded-Host / Host. A cross-site request still
  // fails: its Origin is the attacker's site, not the host it was sent to.
  const allowed = new Set();
  for (const header of ["x-forwarded-host", "host"]) {
    const host = request.headers.get(header)?.split(",")[0]?.trim();
    if (host) allowed.add(host.toLowerCase());
  }
  try {
    allowed.add(new URL(publicOrigin(request)).host.toLowerCase());
  } catch {}

  if (!originHost || !allowed.has(originHost)) {
    console.warn("Rejected billing request origin:", {
      origin,
      allowed: [...allowed],
    });
    throw new BillingError("Invalid request origin.", 403);
  }
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
    vatBps: Number.isInteger(row?.vatBps) ? row.vatBps : VAT_DEFAULT_BPS,
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
  const premium = hasServiceAccess(user, subscription);
  return {
    user,
    workspace,
    subscription,
    premium,
    mode,
    state: user.suspended
      ? "suspended"
      : isAdministrator(user)
        ? "admin"
        : premium && !hasPremium(subscription)
          ? "complimentary"
          : subscriptionState(subscription),
  };
}
export async function premiumGate(userId) {
  await connectDB();
  const user = await User.findById(userId).select("suspended adminRole");
  const workspace = await Workspace.findOne({ ownerId: userId });
  const subscription =
    workspace &&
    (await Subscription.findOne({
      workspaceId: workspace._id,
      mode: billingMode(),
    }));
  if (hasServiceAccess(user, subscription)) return null;
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
