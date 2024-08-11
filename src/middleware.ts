import { verifyJwt } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const allowedPath = ["/site", "/auth"];
  let decodedToken = null;
  console.log(path);
  if (path === "/api/v1/auth/login") return NextResponse.next();
  if (!allowedPath.includes(path)) {
    const nextCookies = cookies();
    const jwtToken = nextCookies.get("notan-credentials")?.value;
    decodedToken = await verifyJwt(jwtToken);
    console.log(decodedToken);
  }
  if (!decodedToken && !allowedPath.includes(path)) {
    if (!path.startsWith("/api/v1/auth") && path.startsWith("/api"))
      return NextResponse.json(
        { message: "User not logged in!" },
        { status: 403 }
      );
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
};
export const config = {
  matcher: ["/((?!/site|_next/static|/api/v1/auth/*|/auth|favicon.ico).*)"],
};
