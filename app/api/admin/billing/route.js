import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/app/models/User";
import QRCode from "@/app/models/QrCode";
import {
  Workspace,
  Subscription,
  Order,
  Commission,
  Withdrawal,
  WebhookEvent,
  PlanVersion,
  BillingSettings,
  AuditLog,
} from "@/app/models/Billing";
import {
  requireAdmin,
  sameOrigin,
  billingError,
  BillingError,
  settings,
  plans,
} from "@/app/lib/billing/access";
import { billingMode, paystack } from "@/app/lib/billing/paystack";
import { fulfill, cancelRenewal, transaction } from "@/app/lib/billing/service";
import { processEvent } from "@/app/lib/billing/events";
import {
  approveWithdrawal,
  rejectWithdrawal,
  reconcileWithdrawal,
} from "@/app/lib/billing/withdrawals";
import { allowAttempt } from "@/app/lib/rate-limit";
import { PLANS } from "@/lib/billing-rules";
const resources = {
  users: User,
  workspaces: Workspace,
  subscriptions: Subscription,
  orders: Order,
  commissions: Commission,
  withdrawals: Withdrawal,
  events: WebhookEvent,
  audit: AuditLog,
};
export async function GET(request) {
  try {
    const actor = await requireAdmin();
    const mode = billingMode();
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource") || "overview";
    if (resource === "overview") {
      const [cash] = await Order.aggregate([
        { $match: { mode, status: "paid" } },
        {
          $group: {
            _id: null,
            gross: { $sum: "$amount" },
            refunds: { $sum: "$refundedAmount" },
          },
        },
      ]);
      const [recurring] = await Subscription.aggregate([
        {
          $match: {
            mode,
            renewalState: "enabled",
            cancelAtPeriodEnd: false,
            paidThrough: { $gt: new Date() },
            status: { $ne: "suspended" },
          },
        },
        {
          $group: {
            _id: null,
            mrr: { $sum: { $divide: ["$plan.amount", "$plan.months"] } },
          },
        },
      ]);
      return Response.json({
        role: actor.adminRole,
        mode,
        metrics: {
          users: await User.countDocuments(),
          qrCodes: await QRCode.countDocuments(),
          paidSubscriptions: await Subscription.countDocuments({
            mode,
            paidThrough: { $gt: new Date() },
            status: { $ne: "suspended" },
          }),
          gross: cash?.gross || 0,
          refunds: cash?.refunds || 0,
          mrr: Math.round(recurring?.mrr || 0),
          failedEvents: await WebhookEvent.countDocuments({
            mode,
            status: "failed",
          }),
          pendingWithdrawals: await Withdrawal.countDocuments({
            mode,
            state: "requested",
          }),
        },
        settings: await settings(),
        plans: await plans(),
      });
    }
    const Model = resources[resource];
    if (!Model) throw new BillingError("Unknown resource.");
    if (
      actor.adminRole === "analyst" ||
      (actor.adminRole === "support" &&
        !["users", "workspaces", "subscriptions"].includes(resource))
    )
      throw new BillingError("This role cannot access these records.", 403);
    const filter = ["users", "workspaces", "audit"].includes(resource)
      ? {}
      : { mode };
    const query = (url.searchParams.get("q") || "").slice(0, 100);
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (mongoose.isValidObjectId(query)) filter._id = query;
      else if (resource === "users")
        filter.$or = [
          { email: { $regex: escaped, $options: "i" } },
          { name: { $regex: escaped, $options: "i" } },
        ];
      else if (resource === "workspaces")
        filter.name = { $regex: escaped, $options: "i" };
      else if (resource === "orders" || resource === "withdrawals")
        filter.reference = query;
      else throw new BillingError("Search this view by record ID.");
    }
    const page = Math.max(
      1,
      Math.min(10000, Number(url.searchParams.get("page")) || 1),
    );
    const records = await Model.find(filter)
      .select(
        "-password -refreshToken -authorizationCode -providerToken -recipientCode -payload -checkoutUrl",
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * 25)
      .limit(25)
      .lean();
    return Response.json({
      records,
      page,
      total: await Model.countDocuments(filter),
    });
  } catch (error) {
    return billingError(error);
  }
}
export async function POST(request) {
  try {
    sameOrigin(request);
    const actor = await requireAdmin(["superadmin", "finance", "support"]);
    if (!(await allowAttempt(`admin:${actor._id}`, 20)))
      throw new BillingError("Please wait before trying again.", 429);
    const body = await request.json();
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    if (reason.length < 5 || reason.length > 500)
      throw new BillingError("Provide a reason of 5–500 characters.");
    const superOnly = [
      "settings",
      "plan",
      "role",
      "suspend",
      "complimentary",
      "referral-toggle",
    ];
    if (superOnly.includes(body.action) && actor.adminRole !== "superadmin")
      throw new BillingError("Superadmin access required.", 403);
    if (actor.adminRole === "support")
      throw new BillingError(
        "Support access is read-only for billing operations.",
        403,
      );
    if (
      !(await bcrypt.compare(
        typeof body.password === "string" ? body.password : "",
        actor.password,
      ))
    )
      throw new BillingError("Confirm your administrator password.", 403);
    const mode = billingMode();
    const audit = (action, resource, before, after) =>
      AuditLog.create({
        actorId: actor._id,
        action,
        resource: String(resource),
        reason,
        before,
        after,
      });
    if (body.action === "settings") {
      const value = body.referral;
      for (const [key, max] of [
        ["discountBps", 5000],
        ["commissionBps", 5000],
        ["holdDays", 365],
        ["attributionDays", 365],
      ])
        if (
          !Number.isInteger(value?.[key]) ||
          value[key] < 0 ||
          value[key] > max
        )
          throw new BillingError(`Invalid ${key}.`);
      if (
        value.minimumWithdrawal !== null &&
        (!Number.isSafeInteger(value.minimumWithdrawal) ||
          value.minimumWithdrawal < 1)
      )
        throw new BillingError(
          "Set a positive withdrawal minimum in kobo, or leave it unset.",
        );
      if (
        typeof value.renewalCommissions !== "boolean" ||
        typeof body.maintenance !== "boolean"
      )
        throw new BillingError("Invalid settings.");
      const before = await settings();
      const referral = Object.fromEntries(
        [
          "discountBps",
          "commissionBps",
          "holdDays",
          "attributionDays",
          "minimumWithdrawal",
          "renewalCommissions",
        ].map((key) => [key, value[key]]),
      );
      await transaction(async (session) => {
        await BillingSettings.findOneAndUpdate(
          { _id: "global" },
          { referral, maintenance: body.maintenance },
          { upsert: true, session },
        );
        await AuditLog.create(
          [
            {
              actorId: actor._id,
              action: "settings.update",
              resource: "global",
              reason,
              before,
              after: { referral, maintenance: body.maintenance },
            },
          ],
          { session },
        );
      });
    } else if (body.action === "plan") {
      const base = PLANS.find((p) => p.key === body.key);
      const date = new Date(body.effectiveAt);
      if (
        !base ||
        !Number.isSafeInteger(body.amount) ||
        body.amount < 100 ||
        body.amount > 100000000 ||
        !Number.isFinite(date.getTime())
      )
        throw new BillingError("Invalid plan configuration.");
      for (const field of ["testPlanCode", "livePlanCode"])
        if (body[field] && !/^PLN_[a-z0-9]+$/i.test(body[field]))
          throw new BillingError("Invalid provider plan code.");
      const latest = await PlanVersion.findOne({ key: base.key }).sort({
        version: -1,
      });
      const version = (latest?.version || 1) + 1;
      await transaction(async (session) => {
        const [created] = await PlanVersion.create(
          [
            {
              ...base,
              version,
              amount: body.amount,
              effectiveAt: date,
              testPlanCode: body.testPlanCode || "",
              livePlanCode: body.livePlanCode || "",
            },
          ],
          { session },
        );
        await AuditLog.create(
          [
            {
              actorId: actor._id,
              action: "plan.publish",
              resource: String(created._id),
              reason,
              after: created.toObject(),
            },
          ],
          { session },
        );
      });
    } else if (["role", "suspend"].includes(body.action)) {
      if (!mongoose.isValidObjectId(body.id) || String(actor._id) === body.id)
        throw new BillingError("Use a different valid account.");
      const target = await User.findById(body.id);
      if (!target) throw new BillingError("Account not found.", 404);
      const field = body.action === "role" ? "adminRole" : "suspended";
      if (
        field === "adminRole" &&
        !["none", "superadmin", "finance", "support", "analyst"].includes(
          body.value,
        )
      )
        throw new BillingError("Invalid role.");
      if (field === "suspended" && typeof body.value !== "boolean")
        throw new BillingError("Invalid status.");
      await transaction(async (session) => {
        await User.updateOne(
          { _id: target._id },
          { [field]: body.value },
          { session },
        );
        await AuditLog.create(
          [
            {
              actorId: actor._id,
              action: `user.${body.action}`,
              resource: String(target._id),
              reason,
              before: { [field]: target[field] },
              after: { [field]: body.value },
            },
          ],
          { session },
        );
      });
    } else if (body.action === "complimentary") {
      const end = new Date(body.until);
      if (
        !mongoose.isValidObjectId(body.id) ||
        !Number.isFinite(end.getTime()) ||
        end <= new Date() ||
        end.getTime() > Date.now() + 366 * 86400000 ||
        !(await Workspace.exists({ _id: body.id }))
      )
        throw new BillingError(
          "Select a workspace and an expiry within one year.",
        );
      await transaction(async (session) => {
        await Subscription.findOneAndUpdate(
          { workspaceId: body.id, mode },
          { complimentaryThrough: end },
          { upsert: true, session },
        );
        await AuditLog.create(
          [
            {
              actorId: actor._id,
              action: "subscription.complimentary",
              resource: body.id,
              reason,
              after: { until: end },
            },
          ],
          { session },
        );
      });
    } else if (body.action === "referral-toggle") {
      if (!mongoose.isValidObjectId(body.id) || typeof body.value !== "boolean")
        throw new BillingError("Invalid workspace.");
      await transaction(async (session) => {
        await Workspace.updateOne(
          { _id: body.id },
          { referralEnabled: body.value },
          { session },
        );
        await AuditLog.create(
          [
            {
              actorId: actor._id,
              action: "referral.toggle",
              resource: body.id,
              reason,
              after: { enabled: body.value },
            },
          ],
          { session },
        );
      });
    } else if (body.action === "verify") {
      await audit("payment.verify.request", body.reference);
      await fulfill(body.reference, mode);
    } else if (body.action === "event") {
      const event =
        mongoose.isValidObjectId(body.id) &&
        (await WebhookEvent.findOne({ _id: body.id, mode }));
      if (!event) throw new BillingError("Event not found.");
      await audit("event.retry", event._id);
      await processEvent(event._id);
    } else if (body.action === "cancel") {
      await audit("subscription.cancel.request", body.id);
      await cancelRenewal(body.id, mode);
    } else if (body.action === "reconcile-subscription") {
      const row = await Subscription.findOne({
        workspaceId: body.id,
        mode,
      }).select("+providerToken");
      if (!row || !/^SUB_[a-z0-9]+$/i.test(body.providerCode || ""))
        throw new BillingError(
          "A workspace and provider subscription code are required.",
        );
      const remote = await paystack(
        `/subscription/${body.providerCode}`,
        undefined,
        mode,
      );
      if (
        remote.customer?.customer_code !== row.providerCustomer ||
        remote.plan?.plan_code !== row.plan?.providerPlan
      )
        throw new BillingError(
          "Provider subscription does not match this workspace.",
        );
      await audit(
        "subscription.reconcile",
        row._id,
        { renewalState: row.renewalState },
        { providerCode: body.providerCode },
      );
      await Subscription.updateOne(
        { _id: row._id },
        {
          providerCode: body.providerCode,
          providerToken: remote.email_token,
          renewalState: ["cancelled", "completed", "non-renewing"].includes(
            remote.status,
          )
            ? "cancelled"
            : "enabled",
          cancelAtPeriodEnd: [
            "cancelled",
            "completed",
            "non-renewing",
          ].includes(remote.status),
        },
      );
    } else if (
      [
        "approve-withdrawal",
        "reject-withdrawal",
        "reconcile-withdrawal",
      ].includes(body.action)
    ) {
      const row =
        mongoose.isValidObjectId(body.id) &&
        (await Withdrawal.findOne({ _id: body.id, mode }));
      if (!row) throw new BillingError("Withdrawal not found.");
      if (body.action === "approve-withdrawal")
        await approveWithdrawal(row._id, actor, reason);
      if (body.action === "reject-withdrawal")
        await rejectWithdrawal(row._id, actor, reason);
      if (body.action === "reconcile-withdrawal") {
        await audit("withdrawal.reconcile", row._id);
        await reconcileWithdrawal(row);
      }
    } else throw new BillingError("Unknown administrator action.");
    return Response.json({ success: true });
  } catch (error) {
    return billingError(error);
  }
}
