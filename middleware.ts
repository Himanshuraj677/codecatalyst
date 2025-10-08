// export const runtime = 'nodejs';

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

const protectedRoute = ["/dashboard", "/profile", "/setting", "/api/course"];

export async function middleware (req: NextRequest) {
    const {pathname} = req.nextUrl;

    if (!protectedRoute.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const session = await auth.api.getSession({headers: req.headers});
    if (!session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/setting/:path*", "/api/course/:path"],
}