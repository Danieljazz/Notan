import { InferSelectModel, and, eq } from "drizzle-orm";
import db from "./db";
import { files, folders, workspaces } from "./schema";
import { JwtProps } from "../auth";
import { NextResponse } from "next/server";
import { WorkspaceSchema } from "../types";

export const getAllUserWorkspaces = async (decodedToken: JwtProps) => {
  return await db.query.workspaces.findMany({
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
  return getWorkspaceFolders(decodedToken, workspaceId);
};

export const updateWorkspace = async (
  decodedToken: JwtProps,
  workspaceId: number,
  updateData: Omit<
    InferSelectModel<typeof workspaces>,
    "id" | "createdAt" | "workspaceOwner"
  >
) => {
  if (!(workspaceId in getAllUserWorkspaces(decodedToken)))
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
  if (!(workspaceId in getAllUserWorkspaces(decodedToken)))
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const getWorkspaceFolders = (
  decodedToken: JwtProps,
  workspaceId: number
) => {
  if (!(workspaceId in getAllUserWorkspaces(decodedToken)))
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return db
    .select()
    .from(folders)
    .leftJoin(
      files,
      and(eq(folders.workspaceId, workspaceId), eq(files.folderId, folders.id))
    );
};

export const getFolder = async (decodedToken: JwtProps, folderId: number) => {
  const foldersWorkspaceId = await db
    .select()
    .from(folders)
    .where(eq(folders.id, folderId));
  if (
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(foldersWorkspaceId[0]?.workspaceId)
  )
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return foldersWorkspaceId;
};

export const createFolder = async (
  decodedToken: JwtProps,
  folderData: Omit<InferSelectModel<typeof folders>, "id" | "createdAt">
) => {
  if (
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(folderData["workspaceId"])
  )
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return db
    .insert(folders)
    .values(folderData)
    .then(() => NextResponse.json({ message: folderData }, { status: 201 }))
    .catch((e) =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
};

export const deleteFolder = async (
  decodedToken: JwtProps,
  folderId: number
) => {
  const dbResult = await db
    .select()
    .from(folders)
    .where(eq(folders.id, folderId));
  const { workspaceId } = dbResult[0];
  if (
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(workspaceId)
  )
    return NextResponse.json(
      { message: "Action not allowed!" },
      { status: 403 }
    );
  return await db.delete(folders).where(eq(folders.id, folderId));
};
