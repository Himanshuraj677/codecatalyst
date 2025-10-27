// export const runtime = 'nodejs';

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoute = ["/dashboard", "/profile", "/setting", "/api/course"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!protectedRoute.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-auth`;
  const res = await fetch(verifyUrl, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  if (res.ok) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/setting/:path*",
    "/api/course/:path",
  ],
};
