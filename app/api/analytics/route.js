import mongoose from "mongoose";
import { premiumGate } from "@/app/lib/billing/access";
import QRCode from "@/app/models/QrCode";
import Scan from "@/app/models/Scan";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
export async function GET(request) {
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
    const url = new URL(request.url);
    const qrId = url.searchParams.get("qr");
    const codes = await QRCode.find({ userId: user.userId })
      .select("_id name scanCount uniqueScanCount type status")
      .lean();
    if (qrId && !codes.some((c) => String(c._id) === qrId))
      return Response.json({ message: "QR not found" }, { status: 404 });
    const now = new Date();
    const days = Math.min(
      366,
      Math.max(1, Number(url.searchParams.get("days")) || 30),
    );
    const from = url.searchParams.get("from")
      ? new Date(url.searchParams.get("from"))
      : new Date(now.getTime() - (days - 1) * 86400000);
    from.setUTCHours(0, 0, 0, 0);
    const to = url.searchParams.get("to")
      ? new Date(url.searchParams.get("to") + "T23:59:59.999Z")
      : now;
    if (
      !Number.isFinite(from.getTime()) ||
      !Number.isFinite(to.getTime()) ||
      from > to
    )
      return Response.json({ message: "Invalid date range" }, { status: 400 });
    const ids = qrId
      ? [new mongoose.Types.ObjectId(qrId)]
      : codes.map((c) => c._id);
    const match = {
      qrCodeId: { $in: ids },
      scannedAt: { $gte: from, $lte: to },
    };
    const group = (field) => [
      {
        $group: {
          _id: { $ifNull: ["$" + field, "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ];
    const [result] = await Scan.aggregate([
      { $match: match },
      {
        $facet: {
          timeline: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$scannedAt",
                    timezone: "UTC",
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          devices: group("deviceType"),
          os: group("os"),
          browsers: group("browser"),
          countries: group("country"),
          byCode: group("qrCodeId"),
          summary: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                first: { $min: "$scannedAt" },
                last: { $max: "$scannedAt" },
              },
            },
          ],
          unique: [
            { $match: { visitorId: { $type: "string" } } },
            { $group: { _id: "$visitorId" } },
            { $count: "count" },
          ],
          recent: [
            { $sort: { scannedAt: -1 } },
            { $limit: 20 },
            {
              $project: {
                deviceType: 1,
                os: 1,
                browser: 1,
                country: 1,
                scannedAt: 1,
              },
            },
          ],
        },
      },
    ]);
    const boundaries = [
      new Date(now),
      new Date(now),
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    ];
    boundaries[0].setUTCHours(0, 0, 0, 0);
    boundaries[1].setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7));
    boundaries[1].setUTCHours(0, 0, 0, 0);
    const counts = await Promise.all(
      boundaries.map((date) =>
        Scan.countDocuments({
          qrCodeId: { $in: ids },
          scannedAt: { $gte: date, $lte: now },
        }),
      ),
    );
    return Response.json({
      success: true,
      codes,
      totals: {
        codes: codes.length,
        scans: result.summary[0]?.total || 0,
        unique: result.unique[0]?.count || 0,
        today: counts[0],
        week: counts[1],
        month: counts[2],
      },
      first: result.summary[0]?.first,
      last: result.summary[0]?.last,
      ...result,
      from,
      to,
    });
  } catch {
    return Response.json(
      { message: "Could not load analytics." },
      { status: 500 },
    );
  }
}
