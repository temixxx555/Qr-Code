import { NextResponse } from "next/server";
import crypto from "crypto";

import QRCode from "@/app/models/QrCode.js";
import { connectDB } from "@/app/lib/mongodb.js";
import { getAuthenticatedUser } from "@/app/lib/auth.js";

const supportedTypes = new Set(["website", "whatsapp", "vcard", "pdf", "wifi", "email", "phone", "sms", "text", "social", "instagram", "facebook", "youtube", "menu", "business", "app", "links", "video", "images", "mp3"]);

function validateContent(type, content) {
  if (!supportedTypes.has(type)) return "Unsupported QR code type";
  if (type === "website" || ["pdf", "links", "business", "video", "images", "facebook", "instagram", "social", "menu", "mp3"].includes(type)) {
    try { const url = new URL(content.url); if (!["http:", "https:"].includes(url.protocol)) return "Please provide a valid HTTP or HTTPS URL"; content.url = url.toString(); } catch { return "Please provide a valid destination URL"; }
  } else if (type === "whatsapp" && !String(content.phone || "").replace(/\D/g, "")) return "A WhatsApp number is required";
  else if (type === "wifi" && !String(content.ssid || "").trim()) return "A Wi-Fi network name is required";
  else if (type === "vcard" && !String(content.name || "").trim()) return "A contact name is required";
  else if (!["whatsapp", "wifi", "vcard"].includes(type) && !String(content.text || "").trim()) return "QR code content is required";
  return null;
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    await connectDB();
    const qrCodes = await QRCode.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, qrCodes });
  } catch (error) {
    console.error("LIST QR ERROR:", error);
    return NextResponse.json({ success: false, message: "Could not load QR codes" }, { status: 500 });
  }
}

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

    if (!type || !supportedTypes.has(type)) {
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
    const contentError = validateContent(type, content);
    if (contentError) return NextResponse.json({ success: false, message: contentError }, { status: 400 });

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
