import crypto from "node:crypto";
import { premiumGate } from "@/app/lib/billing/access";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { applyQrBody, serializeQr, publicOrigin } from "@/app/lib/qr-service";
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    await connectDB();
    const gate = await premiumGate(user.userId);
    if (gate) return gate;
    const codes = await QRCode.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();
    return Response.json({
      success: true,
      qrCodes: codes.map((q) => serializeQr(q)),
    });
  } catch {
    return Response.json(
      { message: "Could not load QR codes." },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    const body = await request.json();
    if (user.suspended)
      return Response.json(
        { message: "This account is suspended. Contact support." },
        { status: 403 },
      );
    if (body.folderId && body.type === "wifi") {
      const gate = await premiumGate(user.userId);
      if (gate) return gate;
    }
    // if (body.type !== "wifi") {
    //   const gate = await premiumGate(user.userId);
    //   if (gate) return gate;
    // }
    const origin = publicOrigin(request);
    await connectDB();
    const qr = new QRCode({
      userId: user.userId,
      shortCode: crypto.randomBytes(9).toString("base64url"),
      publicOrigin: origin,
    });
    await applyQrBody(qr, body, user.userId);
    await qr.save();
    return Response.json(
      { success: true, qrCode: serializeQr(qr) },
      { status: 201 },
    );
  } catch (e) {
    return Response.json(
      {
        message:
          e.code === 11000
            ? "Please try saving again."
            : e.message || "Could not save QR.",
      },
      { status: 400 },
    );
  }
}
