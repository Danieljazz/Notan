import { InferSelectModel, and, eq } from "drizzle-orm";
import db from "./db";
import { files, folders, workspaces } from "./schema";
import { JwtProps } from "../auth";
import { NextResponse } from "next/server";
import { WorkspaceSchema } from "../types";
import * as fs from "fs";
import path from "path";

export const getAllUserWorkspaces = async (decodedToken: JwtProps) => {
  return await db.query.workspaces.findMany({
    where: eq(workspaces.workspaceOwner, decodedToken.id),
  });
};

export const checkIfUserIsWorkspaceOwner = async (
  decodedToken: JwtProps,
  workspaceId: number
) => {
  return (await getAllUserWorkspaces(decodedToken))
    .map((workspaces) => workspaces.id)
    .includes(workspaceId);
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

export const getWorkspaceFolders = async (
  decodedToken: JwtProps,
  workspaceId: number
) => {
  const result = db
    .select({ folders })
    .from(workspaces)
    .innerJoin(
      folders,
      and(eq(folders.workspaceId, workspaceId), eq(workspaces.id, workspaceId))
    );
  return (await result).map((item) => item.folders);
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

export const createFile = async (
  decodedToken: JwtProps,
  fileData: Omit<InferSelectModel<typeof files>, "id" | "createdAt">
) => {
  const dbResult = await db
    .select()
    .from(folders)
    .where(eq(folders.id, fileData["folderId"]));
  if (
    dbResult.length === 0 ||
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(dbResult[0].workspaceId)
  ) {
    console.log("Action not allowed");
    throw new Error("Action not allowed!");
  }
  return "File has been created!";
};

export const getFile = async (decodedToken: JwtProps, id: number) => {
  const fileFolderId = await db.select().from(files).where(eq(files.id, id));
  const folderId = await db
    .select()
    .from(folders)
    .where(eq(folders.id, fileFolderId[0].folderId));
  if (
    folderId.length === 0 ||
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(folderId[0].workspaceId)
  ) {
    throw new Error("Action not allowed!");
  }
  return db.select().from(files).where(eq(files.id, id));
};

export const deleteFile = async (decodedToken: JwtProps, fileId: number) => {
  const folderId = await db.select().from(files).where(eq(files.id, fileId));
  const dbResult = await db
    .select()
    .from(folders)
    .where(eq(folders.id, folderId[0].folderId));
  if (
    dbResult.length === 0 ||
    !(await getAllUserWorkspaces(decodedToken))
      .map((workspace) => workspace.id)
      .includes(dbResult[0].workspaceId)
  ) {
    console.log("Action not allowed");
    throw new Error("Action not allowed!");
  }
  return db.delete(files).where(eq(files.id, fileId));
};
