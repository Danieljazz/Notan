import { verifyJwt } from "@/lib/server-action/auth-actions";
import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const allowedPath = ["/site", "/auth"];
  const decodedToken = verifyJwt();

  if (!decodedToken && !allowedPath.includes(path)) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
};
export const config = {
  matcher: ["/((?!site|_next/static|auth|favicon.ico).*)"],
};
