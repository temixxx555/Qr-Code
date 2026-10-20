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
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not configured");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(`${email}:${code}`)
    .digest("hex");
}

export async function POST(request) {
  let email;

  try {
    console.info("[Password Reset] Request received");

    const body = await request.json();
    const rawEmail = body?.email;
    email = String(rawEmail || "")
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        {
          success: false,
          message: "Enter a valid email address.",
        },
        { status: 400 },
      );
    }

    await connectDB();
    console.info("[Password Reset] Database connected");

    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

    const isProd = process.env.NODE_ENV === "production";

    const allowed = await allowAttempt(
      `password-reset:${email}:${ip}`,
      isProd ? 5 : 100,
      60 * 60 * 1000,
    );

    if (!allowed) {
      console.info("[Password Reset] Request rate-limited");

      return Response.json({
        success: true,
        message: genericMessage,
      });
    }

    const user = await User.findOne({ email }).select("email password");

    console.info("[Password Reset] User lookup:", {
      found: Boolean(user),
      hasPassword: Boolean(user?.password),
    });

    if (!user?.password) {
      console.info("[Password Reset] Skipping send: no password-based account");

      return Response.json({
        success: true,
        message: genericMessage,
      });
    }

    const existing = await PasswordReset.findOne({ email });

    if (
      existing?.lastSentAt &&
      Date.now() - new Date(existing.lastSentAt).getTime() < 60_000
    ) {
      console.info("[Password Reset] Send cooldown active");

      return Response.json({
        success: true,
        message: genericMessage,
      });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM?.trim();
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!apiKey || !from || !accessTokenSecret) {
      console.error("[Password Reset] Missing server configuration:", {
        apiKeyConfigured: Boolean(apiKey),
        senderConfigured: Boolean(from),
        tokenSecretConfigured: Boolean(accessTokenSecret),
      });

      throw new Error("Password reset email configuration is incomplete");
    }

    console.info("[Password Reset] Email configuration present:", {
      sender: from,
    });

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

    const now = new Date();

    // Store a hashed code with a 10-minute expiration.
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
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    console.info("[Password Reset] Calling Resend");

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from,
      to: [email],
      subject: "Your Smart QR password reset code",
      text: [
        "You requested a Smart QR password reset.",
        "",
        `Your password reset code is ${code}.`,
        "It expires in 10 minutes.",
        "",
        "If you didn't request this, you can ignore this email.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#0f172a">
          <div style="padding:28px;border:1px solid #e2e8f0;border-radius:16px">
            <p style="color:#f59e0b;font-weight:700">SMART QR</p>
            <h2>Reset your password</h2>
            <p>Enter this one-time code to choose a new password:</p>
            <p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#f59e0b">
              ${code}
            </p>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request a reset, you can ignore this email.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Password Reset] Resend rejected email:", {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });

      // Invalidate the reset record because sending failed.
      await PasswordReset.deleteOne({ email });

      throw new Error("Resend failed to send the reset email");
    }

    console.info("[Password Reset] Resend accepted email:", {
      id: data?.id,
    });

    return Response.json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("[Password Reset] Request failed:", {
      message:
        error instanceof Error ? error.message : "Unknown password reset error",
    });

    return Response.json(
      {
        success: false,
        message:
          "We couldn’t send a reset code right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
