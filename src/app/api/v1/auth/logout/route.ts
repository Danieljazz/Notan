"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const nextCookies = cookies();
  nextCookies.delete("notan-credentials");
  return NextResponse.json({ message: "User logout properly" });
}
