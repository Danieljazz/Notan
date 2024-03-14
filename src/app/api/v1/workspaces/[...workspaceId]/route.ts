import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { and, eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { JwtProps, verifyJwt } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {}

export async function POST(request: NextRequest) {}

export async function DELETE(
  request: NextApiRequest,
  { params }: { params: { workspaceId: string[] } }
) {
  const workspaceId = Number(params.workspaceId[0]);
  console.log(workspaceId);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const userWorkspaces = await db.query.workspaces.findMany({
    where: and(
      eq(workspaces.id, workspaceId),
      eq(workspaces.workspaceOwner, decodedToken.id)
    ),
  });
  if (userWorkspaces.length === 0)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return db
    .delete(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .then(() =>
      NextResponse.json({ message: "Workspace deleted!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
