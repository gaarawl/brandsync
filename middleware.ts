import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/coming-soon",
  "/api/",
  "/login",
  "/signup",
  "/icon.svg",
  "/_next/",
  "/favicon",
];

function getSessionToken(request: NextRequest) {
  return (
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token")
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getSessionToken(request);

  // Authenticated user on root → go straight to dashboard
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Dashboard routes — require auth
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Allow public paths, API, static assets
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Secret bypass: ?preview=brandsync sets a cookie to skip coming-soon
  if (request.nextUrl.searchParams.get("preview") === "brandsync") {
    const res = NextResponse.redirect(new URL(pathname, request.url));
    res.cookies.set("preview-bypass", "1", {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  }

  // If user has bypass cookie or is logged in, let them through
  if (request.cookies.get("preview-bypass") || token) {
    return NextResponse.next();
  }

  // Everyone else → coming soon
  return NextResponse.redirect(new URL("/coming-soon", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
