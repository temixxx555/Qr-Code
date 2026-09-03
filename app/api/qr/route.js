import { NextResponse } from "next/server";
import crypto from "crypto";

import QRCode from "@/app/models/QrCode.js";
import { connectDB } from "@/app/lib/mongodb.js";
import { getAuthenticatedUser } from "@/app/lib/auth.js";

// Generate a unique short code
async function generateUniqueShortCode() {
  let shortCode;
  let exists = true;

  while (exists) {
    shortCode = crypto.randomBytes(6).toString("base64url");

    exists = await QRCode.exists({
      shortCode,
    });
  }

  return shortCode;
}

export async function POST(request) {
  try {
    // --------------------------------
    // 1. Check authentication
    // --------------------------------

    const authenticatedUser = await getAuthenticatedUser();

    if (!authenticatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to create a QR code",
        },
        { status: 401 },
      );
    }

    const userId = authenticatedUser.userId;

    // --------------------------------
    // 2. Read request body
    // --------------------------------

    const body = await request.json();

    const { name, type, content, design, isDynamic = true } = body;

    // --------------------------------
    // 3. Validate required fields
    // --------------------------------

    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code name is required",
        },
        { status: 400 },
      );
    }

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code type is required",
        },
        { status: 400 },
      );
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "QR code content is required",
        },
        { status: 400 },
      );
    }
    // Validate password if protection is enabled
    if (content.passwordEnabled && !content.password?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required when protection is enabled",
        },
        { status: 400 },
      );
    }

    // --------------------------------
    // 4. Website-specific validation
    // --------------------------------

    if (type === "website") {
      if (!content.url || !content.url.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Website URL is required",
          },
          { status: 400 },
        );
      }

      try {
        const url = new URL(content.url);

        if (!["http:", "https:"].includes(url.protocol)) {
          return NextResponse.json(
            {
              success: false,
              message: "Please provide a valid HTTP or HTTPS URL",
            },
            { status: 400 },
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            message: "Please provide a valid website URL",
          },
          { status: 400 },
        );
      }
    }

    // --------------------------------
    // 5. Connect to MongoDB
    // --------------------------------

    await connectDB();

    // --------------------------------
    // 6. Generate unique short code
    // --------------------------------

    const shortCode = await generateUniqueShortCode();

    // --------------------------------
    // 7. Create QR code
    // --------------------------------

    const qrCode = await QRCode.create({
      userId,
      name: name.trim(),
      type,

      // For website: { url, passwordEnabled, password }
      // The frontend already shapes this correctly in the payload,
      // so pass content through as-is
      content,

      shortCode,
      isDynamic,
      design: design || {},
      status: "active",
      scanCount: 0,
    });

    // --------------------------------
    // 8. Return response
    // --------------------------------

    return NextResponse.json(
      {
        success: true,

        message: "QR code created successfully",

        qrCode: {
          id: qrCode._id,
          name: qrCode.name,
          type: qrCode.type,
          content: qrCode.content,
          shortCode: qrCode.shortCode,

          // This is the URL that will eventually
          // be encoded inside the QR code
          qrUrl: `/r/${qrCode.shortCode}`,

          design: qrCode.design,

          isDynamic: qrCode.isDynamic,

          scanCount: qrCode.scanCount,

          status: qrCode.status,

          createdAt: qrCode.createdAt,
          updatedAt: qrCode.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE QR ERROR:", error);

    // Handle duplicate shortCode just in case
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not generate a unique QR code. Please try again.",
        },
        { status: 409 },
      );
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid QR code data",
          errors: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating the QR code",
      },
      { status: 500 },
    );
  }
}
