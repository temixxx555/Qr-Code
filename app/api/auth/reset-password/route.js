import "server-only";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import PasswordReset from "@/app/models/PasswordReset";
import { allowAttempt } from "@/app/lib/rate-limit";
import { connectDB } from "@/app/lib/mongodb";

function hashCode(email, code) {
  return crypto
    .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");
}

export async function POST(request) {
  try {
    const { email: rawEmail, code: rawCode, password } = await request.json();
    const email = String(rawEmail || "").trim().toLowerCase();
    const code = String(rawCode || "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
      return Response.json(
        { success: false, message: "Enter a valid email and six-digit code." },
        { status: 400 },
      );
    }
    if (typeof password !== "string" || password.length < 8) {
      return Response.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (password.length > 128) {
      return Response.json(
        { success: false, message: "Password must be 128 characters or fewer." },
        { status: 400 },
      );
    }
    if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return Response.json(
        { success: false, message: "Password must include a capital letter and a special character." },
        { status: 400 },
      );
    }

    await connectDB();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
    if (!(await allowAttempt(`password-reset-verify:${email}:${ip}`, 10, 15 * 60 * 1000))) {
      return Response.json(
        { success: false, message: "Too many attempts. Request a new code and try again later." },
        { status: 429 },
      );
    }

    const reset = await PasswordReset.findOne({ email });
    if (!reset || reset.expiresAt.getTime() <= Date.now() || reset.attempts >= 5) {
      return Response.json(
        { success: false, message: "That code is invalid or expired. Request a new one." },
        { status: 400 },
      );
    }

    const expected = Buffer.from(reset.codeHash, "hex");
    const actual = Buffer.from(hashCode(email, code), "hex");
    const matches = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
    if (!matches) {
      reset.attempts += 1;
      if (reset.attempts >= 5) await reset.deleteOne();
      else await reset.save();
      return Response.json(
        { success: false, message: "That code is invalid or expired. Request a new one." },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user?.password) {
      await reset.deleteOne();
      return Response.json(
        { success: false, message: "That code is invalid or expired. Request a new one." },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(password, 12);
    user.refreshToken = null;
    await user.save();
    await reset.deleteOne();

    return Response.json({ success: true, message: "Your password has been updated. You can now sign in." });
  } catch (error) {
    console.error("PASSWORD RESET ERROR:", error);
    return Response.json(
      { success: false, message: "We couldn’t update your password right now. Please try again." },
      { status: 500 },
    );
  }
}
