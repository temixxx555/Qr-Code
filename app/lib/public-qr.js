import "server-only";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "./mongodb";
export async function loadPublicQr(shortCode) {
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(shortCode)) return null;
  await connectDB();
  let qr = await QRCode.findOne({ shortCode, status: "active" })
    .select("+passwordHash")
    .lean();
  // Upgrade older protected records on access without exposing their destination.
  if (
    qr?.content?.passwordEnabled &&
    !qr.passwordHash &&
    typeof qr.content.password === "string"
  ) {
    const content = { ...qr.content };
    const passwordHash = await bcrypt.hash(content.password, 12);
    delete content.password;
    await QRCode.updateOne(
      { _id: qr._id, passwordHash: { $exists: false } },
      { $set: { content, passwordHash } },
    );
    qr = await QRCode.findById(qr._id).select("+passwordHash").lean();
  }
  return qr;
}

// Redirect within this site using a relative Location. Behind a reverse proxy
// (e.g. Hostinger), request.url is the internal address such as 0.0.0.0:3000.
export function localRedirect(path, status = 307) {
  return new NextResponse(null, { status, headers: { Location: path } });
}
