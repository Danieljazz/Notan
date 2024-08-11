import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { and, eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { verifyJwt } from "@/lib/auth";
import { createWorkspace, getAllUserWorkspaces } from "@/lib/mysql/dbQueries";
import { WorkspaceSchema } from "@/lib/types";

export async function GET() {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return getAllUserWorkspaces(decodedToken)
    .then((userWorkspaces) => {
      NextResponse.json({ message: userWorkspaces });
    })
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}

export async function POST(request: NextRequest) {
  const jwtToken = cookies().get("notan-credentials")?.value;
  console.log(jwtToken);
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const requestData = await request.json();
  requestData["workspaceOwner"] = decodedToken.id;
  if (!WorkspaceSchema.safeParse(requestData).success)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return createWorkspace(requestData)
    .then(() =>
      NextResponse.json({ message: "Workspace created!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
