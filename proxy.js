import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const isLoggedIn = !!request.auth;
  const pathname = request.nextUrl.pathname;

  console.log("isLoggedIn: ", isLoggedIn);
  console.log("pathname: ", pathname);
  // protected route
  const isProtectedRoute = pathname.startsWith("/tweets");
  const isProtectedRouteIndex = pathname.startsWith("/");
  const isAuthRoute = pathname.startsWith("/auth");

  // protected api route
  const isProtectedApiRoute = pathname.startsWith("/api/tweets");

  // protected route checking
  if (!isLoggedIn && (isProtectedRoute || isProtectedRouteIndex)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // protected api route checking
  if (!isLoggedIn && isProtectedApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/tweets", request.url));
  }

  return NextResponse.next();
});

export const config = {
  // matcher: ["/tweets/:path*", "/api/tweets/:path*"],
  matcher: ["/tweets/:path*", "/api/tweets/:path*"],
};
