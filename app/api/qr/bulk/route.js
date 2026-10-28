import crypto from "node:crypto";
import { premiumGate } from "@/app/lib/billing/access";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { allowAttempt } from "@/app/lib/rate-limit";
import { applyQrBody, serializeQr, publicOrigin } from "@/app/lib/qr-service";
import { BULK_TYPES, BULK_LIMIT } from "@/lib/bulk-qr";

// Creates up to BULK_LIMIT codes of one type. Each row is validated and saved
// on its own, so one bad row doesn't block the rest.
export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    if (user.suspended)
      return Response.json(
        { message: "This account is suspended. Contact support." },
        { status: 403 },
      );
    await connectDB();
    const gate = await premiumGate(user.userId);
    if (gate) return gate;
    if (!(await allowAttempt(`qr-bulk:${user.userId}`, 20)))
      return Response.json(
        { message: "Too many bulk uploads. Please wait before trying again." },
        { status: 429 },
      );
    const { type, folderId, rows } = await request.json();
    if (!BULK_TYPES.includes(type))
      return Response.json(
        { message: "This QR type can't be created in bulk." },
        { status: 400 },
      );
    if (!Array.isArray(rows) || !rows.length || rows.length > BULK_LIMIT)
      return Response.json(
        { message: `Send between 1 and ${BULK_LIMIT} rows.` },
        { status: 400 },
      );
    const origin = publicOrigin(request);
    const results = [];
    for (const row of rows) {
      try {
        const qr = new QRCode({
          userId: user.userId,
          shortCode: crypto.randomBytes(9).toString("base64url"),
          publicOrigin: origin,
        });
        await applyQrBody(
          qr,
          { name: row?.name, type, content: row?.content, folderId },
          user.userId,
        );
        await qr.save();
        results.push({ ok: true, qrCode: serializeQr(qr) });
      } catch (e) {
        results.push({
          ok: false,
          message:
            e.code === 11000 ? "Please try again." : e.message || "Could not save.",
        });
      }
    }
    return Response.json({ success: true, results });
  } catch (e) {
    return Response.json(
      { message: e.message || "Could not create QR codes." },
      { status: 400 },
    );
  }
}
