import { verifyJwt } from "@/lib/auth";
import db from "@/lib/mysql/db";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// get all user folders
export async function GET() {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
}
