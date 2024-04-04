import { verifyJwt } from "@/lib/auth";
import { createFolder, getWorkspaceFolders } from "@/lib/mysql/dbQueries";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const folderData = await request.json();
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  return await createFolder(decodedToken, folderData)
    .then((userWorkspaces) => userWorkspaces)
    .catch(() =>
      NextResponse.json({ message: "Internal server error" }, { status: 500 })
    );
}
