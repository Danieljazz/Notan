import { verifyJwt } from "@/lib/auth";
import {
  deleteFile,
  deleteFolder,
  getFile,
  getFolder,
  updateFile,
} from "@/lib/mysql/dbQueries";
import { rmSync } from "fs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { files } from "@/lib/mysql/schema";
import { InferSelectModel } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string[] } }
) {
  const fileId = Number(params.fileId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );

  const fileData = await getFile(decodedToken, fileId);
  return await fs
    .readFile(
      path.join(
        String(process.env.NOTE_BASE_DIR),
        String(fileData[0].docFileId)
      ),
      "utf-8"
    )
    .then((data) => NextResponse.json({ message: data }, { status: 200 }))
    .catch(() =>
      NextResponse.json({ message: "Cannot open file" }, { status: 500 })
    );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { fileId: string[] } }
) {
  const requestData: Omit<InferSelectModel<typeof files>, "createdAt"> & {
    content: string;
  } = await request.json();
  const requestedFileId = Number(params.fileId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );

  const fileData = await getFile(decodedToken, requestedFileId);
  await fs
    .writeFile(
      path.join(
        String(process.env.NOTE_BASE_DIR),
        String(fileData[0].docFileId)
      ),
      requestData["content"],
      "utf-8"
    )
    .catch(() =>
      NextResponse.json({ message: "Cannot open file" }, { status: 500 })
    );
  const { content, ...updatedFileData } = requestData;
  updatedFileData["id"] = requestedFileId;
  updatedFileData["docFileId"] = String(fileData[0].docFileId);
  return await updateFile(decodedToken, updatedFileData)
    .then(() => NextResponse.json({ message: "File updated" }, { status: 200 }))
    .catch((e) =>
      NextResponse.json({ message: "Cannot update file" }, { status: 500 })
    );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string[] } }
) {
  const fileId = Number(params.fileId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const txtFileId = await getFile(decodedToken, fileId).then(
    (data) => data[0].docFileId
  );
  return deleteFile(decodedToken, fileId)
    .then(() => {
      rmSync(path.join(String(process.env.NOTE_BASE_DIR), txtFileId!));
      return NextResponse.json({ message: "File deleted!" }, { status: 201 });
    })
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
