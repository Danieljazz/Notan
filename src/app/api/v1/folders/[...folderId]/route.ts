import { verifyJwt } from "@/lib/auth";
import { deleteFolder, getFolder } from "@/lib/mysql/dbQueries";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { folderId: string[] } }
) {
  const folderId = Number(params.folderId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return getFolder(decodedToken, folderId)
    .then((folder) => NextResponse.json({ message: folder }))
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { folderId: string[] } }
) {
  const folderId = Number(params.folderId[0]);
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return deleteFolder(decodedToken, folderId)
    .then(() =>
      NextResponse.json({ message: "Workspace deleted!" }, { status: 201 })
    )
    .catch(() =>
      NextResponse.json({ message: "Server error!" }, { status: 500 })
    );
}
