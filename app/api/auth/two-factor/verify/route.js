import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt";
import { consumeEmailChallenge } from "@/app/lib/auth-challenges";
import { allowAttempt } from "@/app/lib/rate-limit";

export async function POST(request) {
  try {
    const body = await request.json();
    if (
      typeof body.challengeId !== "string" ||
      body.challengeId.length > 100 ||
      !/^\d{6}$/.test(body.code || "")
    )
      return NextResponse.json(
        { success: false, message: "Enter your six-digit sign-in code." },
        { status: 400 },
      );

    await connectDB();
    if (!(await allowAttempt(`two-factor-verify:${body.challengeId}`, 10, 15 * 60 * 1000)))
      return NextResponse.json(
        { success: false, message: "Too many code attempts. Request a new sign-in code." },
        { status: 429 },
      );

    const challenge = await consumeEmailChallenge({
      challengeId: body.challengeId,
      purpose: "login-two-factor",
      code: body.code,
    });
    if (!challenge)
      return NextResponse.json(
        { success: false, message: "That code is invalid or expired. Sign in again to request a new one." },
        { status: 400 },
      );

    const user = await User.findById(challenge.userId);
    if (!user || user.suspended || !user.twoFactorEnabled || !user.isVerified)
      return NextResponse.json(
        { success: false, message: "This sign-in challenge is no longer valid." },
        { status: 403 },
      );

    const rememberMe = challenge.rememberMe === true;
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString(), rememberMe);
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({
      success: true,
      message: "Sign-in verified.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        adminRole: user.adminRole || "none",
      },
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 15 } : {}),
      path: "/",
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("TWO-FACTOR SIGN-IN ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not verify the sign-in code. Please try again." },
      { status: 500 },
    );
  }
}
