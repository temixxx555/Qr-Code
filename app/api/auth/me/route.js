import { NextResponse } from "next/server";

import User from "../../../models/User.js";
import { connectDB } from "@/app/lib/mongodb.js";
import { getAuthenticatedUser } from "@/app/lib/auth.js";

export async function GET() {
  try {
    // Check authentication
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find user
    const user = await User.findById(authUser.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
  } catch (error) {
    console.error("ME ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
