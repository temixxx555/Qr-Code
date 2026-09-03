import { NextResponse } from "next/server";

import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { getAuthenticatedUser } from "@/app/lib/auth";

export async function POST() {
  try {
    const authUser = await getAuthenticatedUser();

    if (authUser) {
      await connectDB();

      await User.findByIdAndUpdate(authUser.userId, {
        refreshToken: null,
      });
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );

    // Remove access token
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    // Remove refresh token
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging out",
      },
      { status: 500 }
    );
  }
}