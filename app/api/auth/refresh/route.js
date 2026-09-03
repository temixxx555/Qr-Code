import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";

import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token not found",
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired refresh token",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    // Make sure this refresh token is still valid
    if (user.refreshToken !== refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token has been revoked",
        },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(
      user._id.toString()
    );

    const newRefreshToken = generateRefreshToken(
      user._id.toString()
    );

    // Rotate refresh token
    user.refreshToken = newRefreshToken;

    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        message: "Token refreshed successfully",
      },
      { status: 200 }
    );

    // New access token
    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    // New refresh token
    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("REFRESH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while refreshing the token",
      },
      { status: 500 }
    );
  }
}