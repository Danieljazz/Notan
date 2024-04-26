import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { appendFile } from "fs";
import path from "path";
import { createFile } from "@/lib/mysql/dbQueries";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  const fileData = await request.json();
  const fileId = `${uuidv4()}.md`;
  fileData["fileId"] = fileId;
  return createFile(decodedToken, fileData)
    .then((msg) => {
      appendFile(
        path.join(String(process.env.NOTE_BASE_DIR), fileId),
        "",
        (err) => console.log(err)
      );
      return NextResponse.json({ message: msg }, { status: 201 });
    })
    .catch((e) =>
      NextResponse.json({ message: "Smth went wrong" }, { status: 500 })
    );
}
