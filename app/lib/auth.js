import { cookies } from "next/headers";
import { verifyAccessToken } from "@/app/lib/jwt";

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
    return decoded;
  } catch (error) {
    return null;
  }
}
