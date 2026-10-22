import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "../../../models/User.js";
import { connectDB } from "@/app/lib/mongodb.js";

import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt.js";
import { createEmailChallenge } from "@/app/lib/auth-challenges";
import { allowAttempt } from "@/app/lib/rate-limit";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, password, rememberMe = false } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      );
    }
    if (typeof rememberMe !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Remember me must be true or false" },
        { status: 400 },
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This account uses Google sign-in. Continue with Google instead.",
        },
        { status: 401 },
      );
    }
    // Compare password
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    if (user.twoFactorEnabled) {
      if (!user.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Verify your email address before using two-factor sign-in.",
          },
          { status: 403 },
        );
      }
      if (!(await allowAttempt(`login-two-factor:${user._id}`, 5, 60 * 60 * 1000))) {
        return NextResponse.json(
          { success: false, message: "Too many sign-in code requests. Try again later." },
          { status: 429 },
        );
      }
      const challenge = await createEmailChallenge(
        user,
        "login-two-factor",
        rememberMe,
      );
      return NextResponse.json({
        success: true,
        requiresTwoFactor: true,
        challengeId: challenge.challengeId,
        emailHint: user.email.replace(/^(.).+(@.*)$/, "$1••••$2"),
        message: "Enter the sign-in code we sent to your email.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());

    const refreshToken = generateRefreshToken(user._id.toString(), rememberMe);

    // Store refresh token
    user.refreshToken = refreshToken;

    await user.save();

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
      { status: 200 },
    );

    // Access token cookie
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 15 } : {}),
      path: "/",
    });

    // Refresh token cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in",
      },
      { status: 500 },
    );
  }
}
