import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import {
  consumeEmailChallenge,
  createEmailChallenge,
  maskEmail,
} from "@/app/lib/auth-challenges";
import { allowAttempt } from "@/app/lib/rate-limit";

export async function POST(request) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth)
      return NextResponse.json(
        { success: false, message: "Sign in to verify your email." },
        { status: 401 },
      );
    if (auth.suspended)
      return NextResponse.json(
        { success: false, message: "This account has been suspended." },
        { status: 403 },
      );

    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user)
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 },
      );

    const body = await request.json();
    if (body.action === "send") {
      if (user.isVerified)
        return NextResponse.json({ success: true, isVerified: true });
      if (!(await allowAttempt(`email-verification:${user._id}`, 3, 60 * 60 * 1000)))
        return NextResponse.json(
          { success: false, message: "Too many verification requests. Try again later." },
          { status: 429 },
        );
      const challenge = await createEmailChallenge(user, "email-verification");
      return NextResponse.json({
        success: true,
        challengeId: challenge.challengeId,
        message: `A verification code was sent to ${maskEmail(user.email)}.`,
      });
    }

    if (body.action === "verify") {
      const challenge = await consumeEmailChallenge({
        challengeId: body.challengeId,
        userId: user._id,
        purpose: "email-verification",
        code: body.code,
      });
      if (!challenge)
        return NextResponse.json(
          { success: false, message: "That code is invalid or expired. Request a new one and try again." },
          { status: 400 },
        );
      user.isVerified = true;
      await user.save();
      return NextResponse.json({
        success: true,
        isVerified: true,
        message: "Your email address is verified.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown email verification action." },
      { status: 400 },
    );
  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not process email verification. Please try again." },
      { status: 500 },
    );
  }
}
