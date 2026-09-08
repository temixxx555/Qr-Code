import Folder from "@/app/models/Folder";
import QRCode from "@/app/models/QrCode";
import { connectDB } from "@/app/lib/mongodb";
import { getAuthenticatedUser } from "@/app/lib/auth";
async function user() {
  const u = await getAuthenticatedUser();
  if (u) await connectDB();
  return u;
}
export async function GET() {
  try {
    const u = await user();
    if (!u)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    return Response.json({
      folders: await Folder.find({ userId: u.userId }).sort({ name: 1 }).lean(),
    });
  } catch {
    return Response.json(
      { message: "Could not load folders" },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const u = await user();
    if (!u)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    const { name } = await request.json();
    if (typeof name !== "string" || !name.trim() || name.length > 80)
      throw new Error("Use a folder name of 1–80 characters.");
    return Response.json(
      { folder: await Folder.create({ userId: u.userId, name: name.trim() }) },
      { status: 201 },
    );
  } catch (e) {
    return Response.json(
      { message: e.code === 11000 ? "Folder already exists." : e.message },
      { status: 400 },
    );
  }
}
export async function PATCH(request) {
  try {
    const u = await user();
    if (!u)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    const { id, name } = await request.json();
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 80
    )
      throw new Error("Invalid folder.");
    const folder = await Folder.findOneAndUpdate(
      { _id: id, userId: u.userId },
      { name: name.trim() },
      { new: true, runValidators: true },
    );
    if (!folder)
      return Response.json({ message: "Folder not found" }, { status: 404 });
    return Response.json({ folder });
  } catch {
    return Response.json(
      { message: "Could not rename folder." },
      { status: 400 },
    );
  }
}
export async function DELETE(request) {
  try {
    const u = await user();
    if (!u)
      return Response.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    const id = new URL(request.url).searchParams.get("id");
    if (await QRCode.exists({ folderId: id, userId: u.userId }))
      throw new Error("Move the QR codes out before deleting this folder.");
    await Folder.deleteOne({ _id: id, userId: u.userId });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json(
      { message: e.message || "Could not delete folder." },
      { status: 400 },
    );
  }
}
