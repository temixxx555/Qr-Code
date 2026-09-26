import { cookies } from "next/headers";
import { verifyAccessToken } from "@/app/lib/jwt";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/mongodb";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    if (
      typeof decoded.userId !== "string" ||
      !/^[a-f0-9]{24}$/i.test(decoded.userId)
    )
      return null;
    await connectDB();
    const user = await User.findById(decoded.userId).select("suspended").lean();
    return user ? { ...decoded, suspended: Boolean(user.suspended) } : null;
  } catch (error) {
    return null;
  }
}
