import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET_KEY,
  });

  const url = request.nextUrl;
  const path = url.pathname;

  // 1. Redirect `/` based on auth
  if (path === "/") {
    return NextResponse.redirect(new URL(token ? "/dashboard" : "/home", request.url));
  }

  // 2. If token exists, block access to auth pages and home
  if (
    token &&
    (
      path === "/home" ||
      path.startsWith("/sign-in") ||
      path.startsWith("/sign-up") ||
      path.startsWith("/verify")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
 
  // 3. If no token, block access to dashboard
  if (!token && path.startsWith("/dashboard") || (!token && path.startsWith("/u"))) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/u/:path*",
    "/home",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};
