import { verifyJwt } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const allowedPath = ["/site", "/auth"];
  const nextCookies = cookies();
  const jwtToken = nextCookies.get("notan-credentials")?.value;
  console.log(jwtToken);
  const decodedToken = verifyJwt(jwtToken);
  if (!decodedToken && !allowedPath.includes(path)) {
    if (!path.startsWith("/api/v1/auth"))
      return NextResponse.json(
        { message: "User not logged in!" },
        { status: 403 }
      );
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
};
export const config = {
  matcher: ["/((?!site|_next/static|api/v1/auth|auth|favicon.ico).*)"],
};
