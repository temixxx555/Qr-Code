import { NextResponse } from "next/server";
import AuthChallenge from "@/app/models/AuthChallenge";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";

export async function POST(request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth)
      return NextResponse.json(
        { success: false, message: "Sign in to update security settings." },
        { status: 401 },
      );
    if (auth.suspended)
      return NextResponse.json(
        { success: false, message: "This account has been suspended." },
        { status: 403 },
      );

    const body = await request.json();
    if (typeof body.enabled !== "boolean")
      return NextResponse.json(
        { success: false, message: "Choose whether to enable or disable two-factor authentication." },
        { status: 400 },
      );

    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 },
      );
    if (body.enabled && !user.isVerified)
      return NextResponse.json(
        { success: false, message: "Verify your email address before enabling two-factor authentication." },
        { status: 400 },
      );

    user.twoFactorEnabled = body.enabled;
    await user.save();
    if (!body.enabled)
      await AuthChallenge.deleteMany({
        userId: user._id,
        purpose: "login-two-factor",
      });

    return NextResponse.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      message: body.enabled
        ? "Two-factor authentication is enabled. Sign-ins will require an email code."
        : "Two-factor authentication is disabled.",
    });
  } catch (error) {
    console.error("TWO-FACTOR SETTINGS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not update two-factor settings." },
      { status: 500 },
    );
  }
}
