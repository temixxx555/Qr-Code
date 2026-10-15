import "server-only";

import crypto from "node:crypto";
import { Resend } from "resend";
import User from "@/app/models/User";
import PasswordReset from "@/app/models/PasswordReset";
import { allowAttempt } from "@/app/lib/rate-limit";
import { connectDB } from "@/app/lib/mongodb";

const genericMessage =
  "If an account with that email exists, we’ve sent a password reset code.";

function hashCode(email, code) {
  return crypto
    .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = String(rawEmail || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    await connectDB();

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    const allowed = await allowAttempt(`password-reset:${email}:${ip}`, 5, 60 * 60 * 1000);
    if (!allowed) {
      return Response.json({ success: true, message: genericMessage });
    }

    const user = await User.findOne({ email }).select("email password");
    if (!user?.password) {
      return Response.json({ success: true, message: genericMessage });
    }

    const existing = await PasswordReset.findOne({ email });
    if (existing && Date.now() - existing.lastSentAt.getTime() < 60_000) {
      return Response.json({ success: true, message: genericMessage });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
      throw new Error("Resend email settings are incomplete");
    }

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
    const now = new Date();
    await PasswordReset.findOneAndUpdate(
      { email },
      {
        $set: {
          codeHash: hashCode(email, code),
          expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
          lastSentAt: now,
          attempts: 0,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: email,
        subject: "Your Smart QR password reset code",
        text: `Your password reset code is ${code}. It expires in 10 minutes. If you didn’t request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0f172a"><div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px"><p style="color:#16a34a;font-weight:700">SMART QR</p><h2>Reset your password</h2><p>Enter this one-time code to choose a new password:</p><p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#16a34a">${code}</p><p>This code expires in 10 minutes. If you didn’t request a reset, you can ignore this email.</p></div></div>`,
      });
      if (error) throw error;
    } catch (error) {
      await PasswordReset.deleteOne({ email });
      throw error;
    }

    return Response.json({ success: true, message: genericMessage });
  } catch (error) {
    console.error("PASSWORD RESET REQUEST ERROR:", error);
    return Response.json(
      { success: false, message: "We couldn’t send a reset code right now. Please try again later." },
      { status: 500 },
    );
  }
}
