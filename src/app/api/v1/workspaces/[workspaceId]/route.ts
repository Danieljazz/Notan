import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { and, eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { JwtProps, verifyJwt } from "@/lib/auth";

export async function GET() {}

export async function POST(request: NextRequest) {}

export async function DELETE(request: NextRequest) {
  const data = request.url;
  console.log(data);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const userWorkspaces = db.query.workspaces.findMany({
    where: and(
      eq(workspaces.id, data.workspaceId),
      eq(workspaces.workspaceOwner, decodedToken.id)
    ),
  });
  if (!userWorkspaces)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return db
    .delete(workspaces)
    .where(eq(workspaces.id, data.workspaceId))
    .then(() =>
      NextResponse.json({ message: "Workspace deleted!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
