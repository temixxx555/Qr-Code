import { NextResponse } from "next/server";

import QRCode from "@/app/models/QrCode.js";
import Scan from "@/app/models/Scan.js";
import { connectDB } from "@/app/lib/mongodb.js";


export async function GET(request, { params }) {
  try {
    // --------------------------------
    // 1. Get the short code
    // --------------------------------

    const { shortCode } = await params;

    if (!shortCode) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code not found",
        },
        { status: 404 }
      );
    }


    // --------------------------------
    // 2. Connect to MongoDB
    // --------------------------------

    await connectDB();


    // --------------------------------
    // 3. Find QR code
    // --------------------------------

    const qrCode = await QRCode.findOne({
      shortCode,
      status: "active",
    });


    // --------------------------------
    // 4. QR doesn't exist
    // --------------------------------

    if (!qrCode) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code not found or inactive",
        },
        { status: 404 }
      );
    }


    // --------------------------------
    // 5. Get request information
    // --------------------------------

    const userAgent =
      request.headers.get("user-agent") || null;

    const referrer =
      request.headers.get("referer") || null;

    // Get the connecting IP when available
    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const realIp =
      request.headers.get("x-real-ip");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      realIp ||
      null;


    // --------------------------------
    // 6. Record the scan
    // --------------------------------

    await Scan.create({
      qrCodeId: qrCode._id,
      userAgent,
      ipAddress,
      referrer,
    });


    // --------------------------------
    // 7. Increase scan count
    // --------------------------------

    await QRCode.updateOne(
      {
        _id: qrCode._id,
      },
      {
        $inc: {
          scanCount: 1,
        },
      }
    );


    // --------------------------------
    // 8. Get destination
    // --------------------------------

    let destinationUrl = null;


    if (["website", "pdf", "links", "business", "video", "images", "facebook", "instagram", "social", "menu", "mp3"].includes(qrCode.type)) destinationUrl = qrCode.content?.url;
    if (qrCode.type === "whatsapp") {
      const phone = String(qrCode.content?.phone || "").replace(/\D/g, "");
      if (phone) destinationUrl = `https://wa.me/${phone}${qrCode.content?.message ? `?text=${encodeURIComponent(qrCode.content.message)}` : ""}`;
    }
    if (qrCode.type === "wifi") {
      const { ssid = "", password = "", encryption = "WPA" } = qrCode.content || {};
      if (ssid) destinationUrl = `WIFI:T:${encryption};S:${String(ssid).replace(/;/g, "\\;")};P:${String(password).replace(/;/g, "\\;")};;`;
    }
    if (qrCode.type === "vcard") {
      const { name = "", phone = "", email = "" } = qrCode.content || {};
      if (name) destinationUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`)}`;
    }
    if (!destinationUrl && qrCode.content?.text) destinationUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(qrCode.content.text)}`;


    // --------------------------------
    // 9. Make sure destination exists
    // --------------------------------

    if (!destinationUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "QR code does not have a valid destination",
        },
        { status: 400 }
      );
    }


    // --------------------------------
    // 10. Redirect
    // --------------------------------

    return NextResponse.redirect(destinationUrl);
  } catch (error) {
    console.error("QR REDIRECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while processing the QR code",
      },
      { status: 500 }
    );
  }
}
