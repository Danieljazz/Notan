import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mysql/db";
import { InferSelectModel, and, eq } from "drizzle-orm";
import { workspaces } from "@/lib/mysql/schema";
import { verifyJwt } from "@/lib/auth";
import { WorkspaceSchema } from "@/lib/types";

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
  return await db.query.workspaces
    .findFirst({
      where: and(
        eq(workspaces.workspaceOwner, decodedToken.id),
        eq(workspaces.id, workspaceId)
      ),
    })
    .then((userWorkspaces) => NextResponse.json({ message: userWorkspaces }))
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { workspaceId: string[] } }
) {
  const requestData: InferSelectModel<typeof workspaces> = await request.json();
  const { workspaceOwner, ...updateData } = requestData;
  const workspaceId = Number(params.workspaceId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const userWorkspaces = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.id, workspaceId),
      eq(workspaces.workspaceOwner, decodedToken.id)
    ),
  });

  if (!userWorkspaces || !WorkspaceSchema.safeParse(requestData).success)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return await db
    .update(workspaces)
    .set(updateData)
    .where(eq(workspaces.id, workspaceId))
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
  const userWorkspaces = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.id, workspaceId),
      eq(workspaces.workspaceOwner, decodedToken.id)
    ),
  });
  if (!userWorkspaces)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return await db
    .delete(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .then(() =>
      NextResponse.json({ message: "Workspace deleted!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
