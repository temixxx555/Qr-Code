import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/User.js";
import { connectDB } from "@/app/lib/mongodb.js";
import { settings } from "@/app/lib/billing/access.js";
import { FREE_TRIAL_DAYS } from "@/lib/billing-rules.js";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, password, confirmPassword } = body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email, password and password confirmation are required",
        },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be between 8 and 128 characters",
        },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must include a capital letter and a special character" },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Your passwords do not match" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const trialSettings = await settings();
    const trialStartedAt = trialSettings.trialEnabled ? new Date() : null;

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      trialStartedAt,
      trialExpiresAt: trialStartedAt
        ? new Date(trialStartedAt.getTime() + FREE_TRIAL_DAYS * 86400000)
        : null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          trialExpiresAt: user.trialExpiresAt || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account",
      },
      { status: 500 }
    );
  }
}
