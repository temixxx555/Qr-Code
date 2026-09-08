import "server-only";
import crypto from "node:crypto";
const version = (qr) =>
  crypto
    .createHash("sha256")
    .update(qr.passwordHash || "")
    .digest("hex");
import jwt from "jsonwebtoken";
export function authorized(qr, token) {
  if (!qr.content?.passwordEnabled) return true;
  try {
    const p = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return (
      p.purpose === "qr-access" &&
      p.qr === String(qr._id) &&
      p.version === version(qr)
    );
  } catch {
    return false;
  }
}
export function accessToken(qr) {
  return jwt.sign(
    { purpose: "qr-access", qr: String(qr._id), version: version(qr) },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" },
  );
}
