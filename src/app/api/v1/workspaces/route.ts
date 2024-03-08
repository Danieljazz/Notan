import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { JwtProps, verifyJwt } from "@/lib/utils";

export async function GET() {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  return NextResponse.json({ message: decodedToken });
  jwt.verify(
    JSON.stringify(jwtToken),
    JSON.stringify(process.env.JWT_SECRET),
    (err, decoded) => {
      if (err)
        return NextResponse.json({
          status: 403,
          message: "Unathoritized user!",
        });
      const userInfo = decoded as JwtProps;
      db.query.workspaces.findMany({
        where: eq(workspaces.workspaceOwner, userInfo.id),
      });
    }
  );
}

export function POST(request: NextRequest) {
  const nextCookies = cookies();
  const jwtToken = nextCookies.get("notan-credentials");
  jwt.verify(
    JSON.stringify(jwtToken),
    JSON.stringify(process.env.JWT_SECRET),
    async (err, decoded) => {
      if (err)
        return NextResponse.json({
          status: 403,
          message: "Unathoritized user!",
        });
      const userInfo = decoded as JwtProps;
      const requestData = await request.json();
      requestData["workspaceOwner"] = userInfo.id;
      db.insert(workspaces).values(requestData);
      db.query.workspaces.findMany({
        where: eq(workspaces.workspaceOwner, userInfo.id),
      });
    }
  );
}

export function DELETE() {}
