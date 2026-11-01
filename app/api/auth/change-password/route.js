import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import User from "@/app/models/User";
import PasswordReset from "@/app/models/PasswordReset";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/app/lib/jwt";
import { allowAttempt } from "@/app/lib/rate-limit";
import { sameOrigin } from "@/app/lib/billing/access";

export async function POST(request) {
  try {
    sameOrigin(request);
    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Sign in to change your password." },
        { status: 401 },
      );
    }
    if (authUser.suspended) {
      return NextResponse.json(
        { success: false, message: "This account has been suspended." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const { newPassword, confirmPassword } = body;
    if (typeof newPassword !== "string" || typeof confirmPassword !== "string") {
      return NextResponse.json(
        { success: false, message: "Enter and confirm your new password." },
        { status: 400 },
      );
    }
    if (newPassword.length < 8 || newPassword.length > 128) {
      return NextResponse.json(
        { success: false, message: "Password must be between 8 and 128 characters." },
        { status: 400 },
      );
    }
    if (!/[A-Z]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json(
        { success: false, message: "Password must include a capital letter and a special character." },
        { status: 400 },
      );
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Your new passwords do not match." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 },
      );
    }

    if (!(await allowAttempt(`password-change:${user._id}`, 5, 15 * 60 * 1000))) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please try again later." },
        { status: 429 },
      );
    }
    if (user.password) {
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
        return NextResponse.json(
          { success: false, message: "Your current password is incorrect." },
          { status: 400 },
        );
      }
      if (await bcrypt.compare(newPassword, user.password)) {
        return NextResponse.json(
          { success: false, message: "Choose a password you have not used before." },
          { status: 400 },
        );
      }
    }

    user.password = await bcrypt.hash(newPassword, 12);

    const cookieStore = await cookies();
    const oldRefreshToken = cookieStore.get("refreshToken")?.value;
    let rememberMe = false;
    if (oldRefreshToken && user.refreshToken === oldRefreshToken) {
      try {
        const decoded = verifyRefreshToken(oldRefreshToken);
        if (decoded.userId === user._id.toString())
          rememberMe = decoded.rememberMe === true;
      } catch {}
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString(), rememberMe);
    user.refreshToken = refreshToken;
    await user.save();
    await PasswordReset.deleteOne({ email: user.email });

    const response = NextResponse.json({
      success: true,
      message: "Your password has been updated.",
    });
    response.cookies.set("accessToken", accessToken || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 15 } : {}),
      path: "/",
    });
    response.cookies.set("refreshToken", refreshToken || "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      path: "/",
    });
    return response;
  } catch (error) {
    if (error?.status === 403) {
      return NextResponse.json(
        { success: false, message: error.message || "Invalid request origin." },
        { status: 403 },
      );
    }
    console.error("CHANGE PASSWORD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not update your password. Please try again." },
      { status: 500 },
    );
  }
}
