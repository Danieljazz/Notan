import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { InferSelectModel } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { verifyJwt } from "@/lib/auth";
import { WorkspaceSchema } from "@/lib/types";
import {
  checkIfUserIsWorkspaceOwner,
  deleteWorkspace,
  getWorkspaceDetails,
  updateWorkspace,
} from "@/lib/mysql/dbQueries";

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string[] } }
) {
  const workspaceId = Number(params.workspaceId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  if (!(await checkIfUserIsWorkspaceOwner(decodedToken, workspaceId)))
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return getWorkspaceDetails(decodedToken, workspaceId)
    .then((userWorkspaces) => NextResponse.json(userWorkspaces))
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { workspaceId: string[] } }
) {
  const requestData: Omit<
    InferSelectModel<typeof workspaces>,
    "createdAt" | "id"
  > = await request.json();
  const { workspaceOwner, ...updateData } = requestData;
  const workspaceId = Number(params.workspaceId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  if (!WorkspaceSchema.safeParse(requestData).success)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return updateWorkspace(decodedToken, workspaceId, updateData)
    .then(() =>
      NextResponse.json({ message: "Workspace edited!" }, { status: 201 })
    )
    .catch((e) => NextResponse.json({ message: e }, { status: 500 }));
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { workspaceId: string[] };
  }
) {
  const workspaceId = Number(params.workspaceId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return deleteWorkspace(decodedToken, workspaceId)
    .then(() =>
      NextResponse.json({ message: "Workspace deleted!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
