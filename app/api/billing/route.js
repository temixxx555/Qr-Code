import {
  context,
  plans,
  settings,
  sameOrigin,
  billingError,
  BillingError,
} from "@/app/lib/billing/access";
import {
  initializeCheckout,
  fulfill,
  cancelRenewal,
  quote,
} from "@/app/lib/billing/service";
import { Order } from "@/app/models/Billing";
import { allowAttempt } from "@/app/lib/rate-limit";
export async function GET() {
  try {
    const ctx = await context();
    const catalog = (await plans()).map(
      ({ key, label, amount, months, version }) => ({
        key,
        label,
        amount,
        months,
        version,
      }),
    );
    return Response.json({
      premium: ctx.premium,
      state: ctx.state,
      mode: ctx.mode,
      adminRole: ctx.user.adminRole,
      checkoutReady: Boolean(
        process.env[
          `PAYSTACK_${ctx.mode.toUpperCase()}_SECRET_KEY`
        ]?.startsWith(`sk_${ctx.mode}_`),
      ),
      workspace: {
        id: ctx.workspace._id,
        name: ctx.workspace.name,
        type: ctx.workspace.type,
        contactEmail: ctx.workspace.contactEmail,
        billingAddress: ctx.workspace.billingAddress,
        logo: ctx.workspace.logo,
      },
      subscription: ctx.subscription && {
        paidThrough: ctx.subscription.paidThrough,
        plan: {
          key: ctx.subscription.plan?.key,
          amount: ctx.subscription.plan?.amount,
        },
        cancelAtPeriodEnd: ctx.subscription.cancelAtPeriodEnd,
        renewalState: ctx.subscription.renewalState,
      },
      plans: catalog,
      referral: (await settings()).referral,
      orders: await Order.find({
        workspaceId: ctx.workspace._id,
        mode: ctx.mode,
      })
        .select(
          "reference amount discount status paidAt createdAt periodEnd refundedAmount plan.label plan.key",
        )
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    });
  } catch (error) {
    return billingError(error);
  }
}
export async function POST(request) {
  try {
    sameOrigin(request);
    const ctx = await context();
    if (!(await allowAttempt(`billing:${ctx.user._id}`, 40)))
      throw new BillingError(
        "Too many requests. Please wait before trying again.",
        429,
      );
    const body = await request.json();
    if (body.action === "quote") {
      const value = await quote(
        ctx.workspace,
        ctx.mode,
        body.plan,
        body.referralCode,
      );
      return Response.json({
        amount: value.amount,
        discount: value.discount,
        renewalAmount: value.plan.amount,
        version: value.plan.version,
        months: value.plan.months,
      });
    }
    if (body.action === "checkout")
      return Response.json(await initializeCheckout(request, body));
    if (body.action === "verify") {
      if (typeof body.reference !== "string" || body.reference.length > 150)
        throw new BillingError("Invalid reference.");
      const order = await fulfill(body.reference, ctx.mode, ctx.user._id);
      return Response.json({
        status: order.status,
        reference: order.reference,
      });
    }
    if (body.action === "cancel") {
      await cancelRenewal(ctx.workspace._id, ctx.mode);
      return Response.json({ success: true });
    }
    throw new BillingError("Unknown billing action.");
  } catch (error) {
    return billingError(error);
  }
}
