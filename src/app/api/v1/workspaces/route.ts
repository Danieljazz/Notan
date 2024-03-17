import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { and, eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return await db.query.workspaces
    .findMany({
      where: eq(workspaces.workspaceOwner, decodedToken.id),
    })
    .then((userWorkspaces) => {
      NextResponse.json({ message: userWorkspaces });
    })
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}

export async function POST(request: NextRequest) {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const requestData = await request.json();
  requestData["workspaceOwner"] = decodedToken.id;
  return db
    .insert(workspaces)
    .values(requestData)
    .then(() =>
      NextResponse.json({ message: "Workspace created!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
