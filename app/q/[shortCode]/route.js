import { loadPublicQr } from "@/app/lib/public-qr";
import crypto from "node:crypto";
import { NextResponse, after } from "next/server";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { authorized } from "@/app/lib/scan-access";
import { recordScan } from "@/app/lib/scan";
import { safeUrl, whatsappUrl } from "@/lib/qr-content";
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { shortCode } = await params;
    const qr = await loadPublicQr(shortCode);
    if (!qr)
      return new Response("This QR code is unavailable or paused.", {
        status: 404,
      });
    if (!authorized(qr, request.cookies.get("qr-access-" + shortCode)?.value))
      return NextResponse.redirect(
        new URL("/q/" + shortCode + "/unlock", request.url),
      );
    const c = qr.content || {};
    let destination = "";
    if (
      c.url &&
      (((qr.type === "links" || qr.type === "social") && !c.links) ||
        (qr.type === "images" && !c.images) ||
        (qr.type === "business" && !c.name) ||
        (qr.type === "menu" && !c.mode && !c.categories))
    )
      destination = safeUrl(c.url);
    if (qr.type === "website") destination = safeUrl(c.websiteUrl || c.url);
    if (qr.type === "whatsapp") destination = whatsappUrl(c);
    if (qr.type === "menu" && c.mode === "url") destination = safeUrl(c.url);
    if (qr.type === "apps" || qr.type === "app") {
      const ua = request.headers.get("user-agent") || "";
      if (/iphone|ipad|ipod/i.test(ua)) destination = safeUrl(c.iosUrl);
      else if (/android/i.test(ua)) destination = safeUrl(c.androidUrl);
    }
    const visitor =
      request.cookies.get("qr-visitor")?.value || crypto.randomUUID();
    const response = NextResponse.redirect(
      destination || new URL("/q/" + shortCode + "/view", request.url),
    );
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.cookies.set("qr-visitor", visitor, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 31536000,
      path: "/",
    });
    if (qr.isDynamic !== false) after(() => recordScan(qr, request, visitor));
    return response;
  } catch {
    return new Response(
      "This QR is temporarily unavailable. Please try again.",
      { status: 503 },
    );
  }
}
