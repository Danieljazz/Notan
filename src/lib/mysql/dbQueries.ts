import { InferSelectModel, and, eq } from "drizzle-orm";
import db from "./db";
import { workspaces } from "./schema";
import { JwtProps } from "../auth";
import { NextResponse } from "next/server";
import { WorkspaceSchema } from "../types";

export const getAllUserWorkspaces = async (decodedToken: JwtProps) => {
  return db.query.workspaces.findMany({
    where: eq(workspaces.workspaceOwner, decodedToken.id),
  });
};

export const createWorkspace = async (
  requestData: Omit<InferSelectModel<typeof workspaces>, "id" | "createdAt">
) => {
  return db.insert(workspaces).values(requestData);
};

export const getWorkspaceDetails = async (
  decodedToken: JwtProps,
  workspaceId: number
) => {
  return db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.workspaceOwner, decodedToken.id),
      eq(workspaces.id, workspaceId)
    ),
  });
};

export const updateWorkspace = async (
  decodedToken: JwtProps,
  workspaceId: number,
  updateData: Omit<
    InferSelectModel<typeof workspaces>,
    "id" | "createdAt" | "workspaceOwner"
  >
) => {
  const userWorkspaces = await getWorkspaceDetails(decodedToken, workspaceId);
  if (!userWorkspaces)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return db
    .update(workspaces)
    .set(updateData)
    .where(eq(workspaces.id, workspaceId));
};

export const deleteWorkspace = async (
  decodedToken: JwtProps,
  workspaceId: number
) => {
  const userWorkspaces = await getWorkspaceDetails(decodedToken, workspaceId);
  if (!userWorkspaces)
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};
