import { NextResponse } from "next/server";
import QRCode from "@/app/models/QrCode";
import Scan from "@/app/models/Scan";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";

export async function GET() { try { const user = await getAuthenticatedUser(); if (!user) return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 }); await connectDB(); const codes = await QRCode.find({ userId: user.userId }).select("_id name scanCount type status").lean(); const ids = codes.map((code) => code._id); const scans = ids.length ? await Scan.find({ qrCodeId: { $in: ids } }).sort({ scannedAt: -1 }).limit(20).lean() : []; return NextResponse.json({ success: true, totals: { codes: codes.length, scans: codes.reduce((sum, code) => sum + code.scanCount, 0), active: codes.filter((code) => code.status === "active").length }, codes, scans }); } catch { return NextResponse.json({ success: false, message: "Could not load analytics" }, { status: 500 }); } }
