import "server-only";
import { verifyWebhookSignature } from "@/lib/billing-security";
export function billingMode() {
    const value = process.env.PAYSTACK_MODE || "test";

  if (!["test", "live"].includes(value)) {
    throw new Error("Invalid Paystack environment.");
  }
  return value;
}
export function secretKey(mode = billingMode()) {
  const key = process.env[`PAYSTACK_${mode.toUpperCase()}_SECRET_KEY`];
  if (!key?.startsWith(`sk_${mode}_`))
    throw new Error("Paystack is not configured. Please contact support.");
  return key;
}
export async function paystack(path, body, mode = billingMode()) {
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${secretKey(mode)}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json();
  if (!response.ok || !result.status)
    throw new Error(
      "Paystack could not complete this operation. Check its status before retrying.",
    );
  return result.data;
}
export function validSignature(raw, signature, mode) {
  return verifyWebhookSignature(raw, signature, secretKey(mode));
}
