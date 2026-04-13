import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/coming-soon",
  "/api/",
  "/login",
  "/signup",
  "/icon.svg",
  "/_next/",
  "/favicon",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Dashboard routes — require auth
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Allow public paths, API, static assets
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Secret bypass: ?preview=brandsync sets a cookie to skip coming-soon
  if (req.nextUrl.searchParams.get("preview") === "brandsync") {
    const res = NextResponse.redirect(new URL(pathname, req.url));
    res.cookies.set("preview-bypass", "1", {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  }

  // If user has bypass cookie or is logged in, let them through
  if (req.cookies.get("preview-bypass") || isAuthenticated) {
    return NextResponse.next();
  }

  // Everyone else → coming soon
  return NextResponse.redirect(new URL("/coming-soon", req.url));
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
