import mongoose from "mongoose";
import QRCode from "@/app/models/QrCode";
import Scan from "@/app/models/Scan";
import ScanVisitor from "@/app/models/ScanVisitor";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { applyQrBody, serializeQr } from "@/app/lib/qr-service";
async function owned(id) {
  const user = await getAuthenticatedUser();
  if (!user)
    return {
      error: Response.json(
        { message: "Authentication required" },
        { status: 401 },
      ),
    };
  if (!mongoose.isValidObjectId(id))
    return {
      error: Response.json({ message: "QR not found" }, { status: 404 }),
    };
  await connectDB();
  const qr = await QRCode.findOne({ _id: id, userId: user.userId }).select(
    "+passwordHash",
  );
  return qr
    ? { qr, user }
    : { error: Response.json({ message: "QR not found" }, { status: 404 }) };
}
export async function GET(request, { params }) {
  try {
    const { qr, error } = await owned((await params).id);
    return error || Response.json({ success: true, qrCode: serializeQr(qr) });
  } catch {
    return Response.json({ message: "Could not load QR." }, { status: 500 });
  }
}
export async function PATCH(request, { params }) {
  try {
    const { qr, user, error } = await owned((await params).id);
    if (error) return error;
    await applyQrBody(qr, await request.json(), user.userId);
    await qr.save();
    return Response.json({ success: true, qrCode: serializeQr(qr) });
  } catch (e) {
    return Response.json(
      { message: e.message || "Could not update QR." },
      { status: 400 },
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    const { qr, error } = await owned((await params).id);
    if (error) return error;
    await qr.deleteOne();
    await Scan.deleteMany({ qrCodeId: qr._id });
    await ScanVisitor.deleteMany({ qrCodeId: qr._id });
    return Response.json({ success: true });
  } catch {
    return Response.json({ message: "Could not delete QR." }, { status: 500 });
  }
}
