import { allowAttempt } from "@/app/lib/rate-limit";
import { loadPublicQr } from "@/app/lib/public-qr";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { accessToken } from "@/app/lib/scan-access";
export async function POST(request, { params }) {
  const { shortCode } = await params;
  const fail = () =>
    NextResponse.redirect(
      new URL("/q/" + shortCode + "/unlock?error=1", request.url),
      303,
    );
  try {
    await connectDB();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!(await allowAttempt("unlock:" + shortCode + ":" + ip)))
      return new Response("Too many attempts. Try again in 15 minutes.", {
        status: 429,
        headers: { "Retry-After": "900" },
      });
    const qr = await loadPublicQr(shortCode);
    const password = (await request.formData()).get("password");
    if (
      !qr?.passwordHash ||
      typeof password !== "string" ||
      password.length > 72 ||
      !(await bcrypt.compare(password, qr.passwordHash))
    )
      return fail();
    const response = NextResponse.redirect(
      new URL("/q/" + shortCode, request.url),
      303,
    );
    response.cookies.set("qr-access-" + shortCode, accessToken(qr), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });
    return response;
  } catch {
    return fail();
  }
}
