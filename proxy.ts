import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null);

  if (!token && request.nextUrl.pathname !== "/auth") {
    const url = new URL("/auth", request.url);
    return NextResponse.redirect(url);
  }

  if (token && request.nextUrl.pathname === "/auth") {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\.css$).*)"],
};
