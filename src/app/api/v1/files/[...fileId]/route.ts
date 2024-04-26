import { verifyJwt } from "@/lib/auth";
import {
  deleteFile,
  deleteFolder,
  getFile,
  getFolder,
} from "@/lib/mysql/dbQueries";
import { rmSync } from "fs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

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
  return getFile(decodedToken, fileId)
    .then((file) => NextResponse.json({ message: file }))
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
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
    (data) => data[0].fileId
  );
  return deleteFile(decodedToken, fileId)
    .then(() => {
      rmSync(path.join(String(process.env.NOTE_BASE_DIR), txtFileId!));
      return NextResponse.json(
        { message: "Workspace deleted!" },
        { status: 201 }
      );
    })
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
