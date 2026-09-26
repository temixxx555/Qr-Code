import { context, billingError, BillingError } from "@/app/lib/billing/access";
import { Order } from "@/app/models/Billing";
import { money } from "@/lib/billing-rules";
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export async function GET(request) {
  try {
    const { workspace, mode } = await context();
    const reference = new URL(request.url).searchParams.get("reference");
    const order = await Order.findOne({
      workspaceId: workspace._id,
      mode,
      reference,
      status: "paid",
    });
    if (!order) throw new BillingError("Receipt not found.", 404);
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Payment receipt</title><style>body{font:16px system-ui;max-width:640px;margin:60px auto;padding:24px;color:#18342b}dt{color:#64748b;margin-top:22px}dd{margin:6px 0;overflow-wrap:anywhere}h1{color:#059669}</style><h1>Smart QR · Payment receipt</h1>${mode === "test" ? "<p>TEST PAYMENT — no cash value</p>" : ""}<dl><dt>Reference</dt><dd>${escape(order.reference)}</dd><dt>Plan</dt><dd>${escape(order.plan.label)}</dd><dt>Amount paid</dt><dd>${escape(money(order.amount))}</dd><dt>Referral discount</dt><dd>${escape(money(order.discount || 0))}</dd><dt>Paid on</dt><dd>${escape(order.paidAt.toISOString())}</dd><dt>Paid period ends</dt><dd>${escape(order.periodEnd.toISOString())}</dd><dt>Refunded</dt><dd>${escape(money(order.refundedAmount))}</dd></dl><p>Keep this receipt for your records. You can save or print it using your browser.</p></html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
          "Content-Security-Policy":
            "default-src 'none'; style-src 'unsafe-inline'",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    return billingError(error);
  }
}
