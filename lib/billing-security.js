import crypto from "node:crypto";
export function verifyWebhookSignature(raw, signature, secret) {
  if (!/^[a-f0-9]{128}$/i.test(signature || "") || !secret) return false;
  return crypto.timingSafeEqual(
    crypto.createHmac("sha512", secret).update(raw).digest(),
    Buffer.from(signature, "hex"),
  );
}
