import { NextResponse } from "next/server";

export function proxy(request) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // User is logged in and tries to visit login/signup
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

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
