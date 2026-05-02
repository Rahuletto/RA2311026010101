import { NextRequest, NextResponse } from "next/server";

/** Paths served from /public must bypass auth — otherwise fetches get an HTML redirect. */
function isPublicStaticPath(pathname: string) {
  if (pathname.startsWith("/assets/")) return true;
  if (pathname === "/favicon.ico") return true;
  return /\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|txt|json|xml|webmanifest)$/i.test(
    pathname
  );
}

export function proxy(request: NextRequest) {
  if (isPublicStaticPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Server-only: localStorage is never available here (previous branch was dead code).
  const token = request.cookies.get("auth_token")?.value ?? null;

  if (!token && request.nextUrl.pathname !== "/auth" && request.nextUrl.pathname !== "/sign-up") {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  if (token && (request.nextUrl.pathname === "/auth" || request.nextUrl.pathname === "/sign-up")) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\.css$).*)"],
};
