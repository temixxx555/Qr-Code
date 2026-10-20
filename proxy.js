import { NextResponse } from "next/server";

export function proxy(request) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // User is not logged in and tries to visit dashboard
  if (
    !accessToken &&
    !request.cookies.get("refreshToken")?.value &&
    isProtectedPage
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/admin/:path*"],
};
