import "server-only";

import crypto from "node:crypto";
import { Resend } from "resend";
import AuthChallenge from "@/app/models/AuthChallenge";

const CHALLENGE_LIFETIME_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function secret() {
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  return process.env.ACCESS_TOKEN_SECRET;
}

function digest(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(left, right) {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createEmailChallenge(user, purpose, rememberMe = false) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) throw new Error("Email delivery is not configured");

  const challengeId = crypto.randomBytes(32).toString("base64url");
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CHALLENGE_LIFETIME_MS);
  const challengeHash = digest(`challenge:${challengeId}`);
  const subject =
    purpose === "login-two-factor"
      ? "Your Smart QR sign-in code"
      : "Verify your Smart QR email address";
  const instruction =
    purpose === "login-two-factor"
      ? "Enter this one-time code to finish signing in:"
      : "Enter this one-time code in My Account to verify your email address:";

  await AuthChallenge.deleteMany({ userId: user._id, purpose });
  await AuthChallenge.create({
    challengeHash,
    userId: user._id,
    email: user.email,
    purpose,
    codeHash: digest(`${challengeHash}:${code}`),
    rememberMe,
    attempts: 0,
    expiresAt,
  });

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [user.email],
      subject,
      text: `${instruction}\n\n${code}\n\nThis code expires in 10 minutes. If you did not request it, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0f172a"><div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px"><p style="color:#16a34a;font-weight:700">SMART QR</p><h2>${subject}</h2><p>${instruction}</p><p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#16a34a">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div></div>`,
    });
    if (error) throw new Error(error.message || "Resend failed to send email");
  } catch (error) {
    await AuthChallenge.deleteOne({ challengeHash });
    throw error;
  }

  return { challengeId, expiresInSeconds: CHALLENGE_LIFETIME_MS / 1000 };
}

export async function consumeEmailChallenge({
  challengeId,
  userId,
  purpose,
  code,
}) {
  if (!/^\d{6}$/.test(code || "")) return null;

  const query = {
    purpose,
    attempts: { $lt: MAX_ATTEMPTS },
    expiresAt: { $gt: new Date() },
    ...(userId ? { userId } : {}),
    ...(challengeId
      ? { challengeHash: digest(`challenge:${challengeId}`) }
      : {}),
  };
  if (!challengeId && !userId) return null;

  const challenge = await AuthChallenge.findOne(query);
  if (!challenge) return null;

  const expected = digest(`${challenge.challengeHash}:${code}`);
  if (!safeEqual(expected, challenge.codeHash)) {
    await AuthChallenge.updateOne(
      { _id: challenge._id, attempts: { $lt: MAX_ATTEMPTS } },
      { $inc: { attempts: 1 } },
    );
    return null;
  }

  return AuthChallenge.findOneAndDelete({
    _id: challenge._id,
    attempts: { $lt: MAX_ATTEMPTS },
    expiresAt: { $gt: new Date() },
    codeHash: challenge.codeHash,
  });
}

export function maskEmail(email) {
  const [name, domain] = String(email || "").split("@");
  if (!name || !domain) return "your email address";
  return `${name.slice(0, 1)}${"•".repeat(Math.min(Math.max(name.length - 1, 2), 8))}@${domain}`;
}
