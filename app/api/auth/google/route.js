import { NextResponse } from "next/server";

import User from "../../../models/User.js";
import { connectDB } from "@/app/lib/mongodb.js";
import { adminAuth } from "@/lib/firebase-admin.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt.js";

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Google authentication token is required",
        },
        { status: 400 }
      );
    }

    // Verify token with Firebase
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const email = decodedToken.email?.trim().toLowerCase();
    const name = decodedToken.name || "Google User";
    const googleUid = decodedToken.uid;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Google account does not provide an email address",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Look for existing account
    let user = await User.findOne({
      email,
    });

    // If no account exists, create one
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        googleUid,
        authProvider: "google",
        isVerified: true,
      });
    } else {
      // Existing email/password account can also use Google
      if (!user.googleUid) {
        user.googleUid = googleUid;
      }

      user.isVerified = true;
    }

    if (user.suspended) {
      return NextResponse.json(
        {
          success: false,
          message: "This account has been suspended",
        },
        { status: 403 }
      );
    }

    // Generate YOUR existing JWT tokens
    const accessToken = generateAccessToken(
      user._id.toString()
    );

    const refreshToken = generateRefreshToken(
      user._id.toString()
    );

    user.refreshToken = refreshToken;

    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        message: "Google authentication successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          adminRole: user.adminRole || "none",
        },
      },
      { status: 200 }
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Google authentication failed",
      },
      { status: 401 }
    );
  }
}