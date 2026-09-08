import "server-only";
import crypto from "node:crypto";
import RateLimit from "@/app/models/RateLimit";
export async function allowAttempt(key, maximum = 10, windowMs = 900000) {
  const bucket = Math.floor(Date.now() / windowMs);
  const id = crypto
    .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
    .update(`${key}:${bucket}`)
    .digest("hex");
  const row = await RateLimit.findOneAndUpdate(
    { _id: id },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date((bucket + 1) * windowMs) },
    },
    { upsert: true, new: true },
  );
  return row.count <= maximum;
}
