import "server-only";

import ScanVisitor from "@/app/models/ScanVisitor";
import crypto from "node:crypto";

import Scan from "@/app/models/Scan";
import QRCode from "@/app/models/QrCode";

export async function recordScan(qr, request, visitor) {
  try {
    const ua = request.headers.get("user-agent") || "";

    const visitorHash = crypto
      .createHmac(
        "sha256",
        process.env.ANALYTICS_HASH_SECRET || process.env.ACCESS_TOKEN_SECRET,
      )
      .update(visitor)
      .digest("hex");

    const seen = await ScanVisitor.updateOne(
      {
        qrCodeId: qr._id,
        visitorId: visitorHash,
      },
      {
        $setOnInsert: {
          qrCodeId: qr._id,
          visitorId: visitorHash,
        },
      },
      {
        upsert: true,
      },
    );

    const first = seen.upsertedCount === 1;

    // IP
    const forwardedFor = request.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    // Referrer
    let referrer = null;

    const refererHeader = request.headers.get("referer");

    if (refererHeader) {
      try {
        referrer = new URL(refererHeader).origin;
      } catch {
        referrer = refererHeader;
      }
    }

    // Country

    await Scan.create({
      qrCodeId: qr._id,
      visitorId: visitorHash,

      // Device
      deviceType: /ipad|tablet/i.test(ua)
        ? "Tablet"
        : /mobile|iphone|android/i.test(ua)
          ? "Mobile"
          : "Desktop",

      // Operating system
      os: /android/i.test(ua)
        ? "Android"
        : /iphone|ipad/i.test(ua)
          ? "iOS"
          : /windows/i.test(ua)
            ? "Windows"
            : /macintosh|mac os x/i.test(ua)
              ? "macOS"
              : /linux/i.test(ua)
                ? "Linux"
                : "Other",

      // Browser
      browser: /edg/i.test(ua)
        ? "Edge"
        : /firefox|fxios/i.test(ua)
          ? "Firefox"
          : /chrome|crios/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other",

      country:
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("cf-ipcountry") ||
        "Unknown",

      // You were missing these
      userAgent: ua || null,
      ipAddress,
      referrer,

      scannedAt: new Date(),
    });

    await QRCode.updateOne(
      {
        _id: qr._id,
      },
      {
        $inc: {
          scanCount: 1,
          uniqueScanCount: first ? 1 : 0,
        },
      },
    );
  } catch (error) {
    console.error("Scan analytics unavailable", error);
  }
}
