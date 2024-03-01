import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { eq } from "drizzle-orm";
import { workspaces, users } from "@/lib/mysql/schema";

type JWTProps = {
  id: string;
  name: string;
};

export function GET() {
  const nextCookies = cookies();
  const jwtToken = nextCookies.get("notan-cred entials");
  jwt.verify(
    JSON.stringify(jwtToken),
    JSON.stringify(process.env.JWT_SECRET),
    (err, decoded) => {
      if (err)
        return NextResponse.json({
          status: 403,
          message: "Unathoritized user!",
        });
      const userInfo = decoded as JWTProps;
      db.query.workspaces.findMany({
        where: eq(workspaces.workspaceOwner, userInfo.id),
      });
    }
  );
}
