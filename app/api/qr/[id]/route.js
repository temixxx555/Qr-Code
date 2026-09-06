import { NextResponse } from "next/server";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";

async function ownedQr(id) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 }) };
  await connectDB();
  const qrCode = await QRCode.findOne({ _id: id, userId: user.userId });
  if (!qrCode) return { error: NextResponse.json({ success: false, message: "QR code not found" }, { status: 404 }) };
  return { qrCode };
}

export async function PATCH(request, { params }) {
  try {
    const { qrCode, error } = await ownedQr((await params).id); if (error) return error;
    const body = await request.json();
    if (body.name !== undefined) qrCode.name = String(body.name).trim().slice(0, 100);
    if (body.status !== undefined && ["active", "inactive"].includes(body.status)) qrCode.status = body.status;
    if (body.content?.url !== undefined) { const url = new URL(body.content.url); if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Invalid destination URL"); qrCode.content = { ...qrCode.content, url: url.toString() }; }
    if (body.design && typeof body.design === "object") qrCode.design = { ...qrCode.design.toObject(), ...body.design };
    await qrCode.save(); return NextResponse.json({ success: true, qrCode });
  } catch (error) { return NextResponse.json({ success: false, message: error.message || "Could not update QR code" }, { status: 400 }); }
}

export async function DELETE(_request, { params }) { try { const { qrCode, error } = await ownedQr((await params).id); if (error) return error; await qrCode.deleteOne(); return NextResponse.json({ success: true }); } catch { return NextResponse.json({ success: false, message: "Could not delete QR code" }, { status: 500 }); } }
