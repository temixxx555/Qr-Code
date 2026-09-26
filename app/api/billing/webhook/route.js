import crypto from "node:crypto";
import { after } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { billingMode, validSignature } from "@/app/lib/billing/paystack";
import { WebhookEvent } from "@/app/models/Billing";
import { eventPayload, processEvent } from "@/app/lib/billing/events";
export const runtime = "nodejs";
export async function POST(request) {
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 262144)
      return new Response("Too large", { status: 413 });
    const mode = billingMode();
    if (!validSignature(raw, request.headers.get("x-paystack-signature"), mode))
      return new Response("Invalid signature", { status: 401 });
    const body = JSON.parse(raw);
    if (
      !body.event ||
      !body.data ||
      (body.data.domain && body.data.domain !== mode)
    )
      return new Response("Invalid event", { status: 400 });
    await connectDB();
    await WebhookEvent.init();
    const key = `${mode}:${crypto.createHash("sha256").update(raw).digest("hex")}`;
    let event;
    try {
      event = await WebhookEvent.create({
        key,
        mode,
        type: body.event,
        payload: eventPayload(body.data),
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      event = await WebhookEvent.findOne({ key });
    }
    after(() => processEvent(event._id));
    return new Response("Received", { status: 200 });
  } catch {
    return new Response("Webhook not persisted", { status: 503 });
  }
}
