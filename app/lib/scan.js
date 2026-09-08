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
      { qrCodeId: qr._id, visitorId: visitorHash },
      { $setOnInsert: { qrCodeId: qr._id, visitorId: visitorHash } },
      { upsert: true },
    );
    const first = seen.upsertedCount === 1;
    await Scan.create({
      qrCodeId: qr._id,
      visitorId: visitorHash,
      deviceType: /ipad|tablet/i.test(ua)
        ? "Tablet"
        : /mobile|iphone|android/i.test(ua)
          ? "Mobile"
          : "Desktop",
      os: /android/i.test(ua)
        ? "Android"
        : /iphone|ipad/i.test(ua)
          ? "iOS"
          : /windows/i.test(ua)
            ? "Windows"
            : /mac/i.test(ua)
              ? "macOS"
              : /linux/i.test(ua)
                ? "Linux"
                : "Other",
      browser: /edg/i.test(ua)
        ? "Edge"
        : /firefox/i.test(ua)
          ? "Firefox"
          : /chrome|crios/i.test(ua)
            ? "Chrome"
            : /safari/i.test(ua)
              ? "Safari"
              : "Other",
      country:
        process.env.TRUST_GEO_HEADERS === "true"
          ? request.headers.get("x-vercel-ip-country") || "Unknown"
          : "Unknown",
      referrer: (() => {
        try {
          return new URL(request.headers.get("referer")).origin;
        } catch {
          return null;
        }
      })(),
    });
    await QRCode.updateOne(
      { _id: qr._id },
      { $inc: { scanCount: 1, uniqueScanCount: first ? 1 : 0 } },
    );
  } catch (error) {
    console.error("Scan analytics unavailable", error.name);
  }
}
