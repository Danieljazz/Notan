"use server";

import db from "@/lib/mysql/db";
import { users } from "@/lib/mysql/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await db.query.users.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  // const resp = await db.insert(users).values(request);
  const data = await request.json();
  try {
    const resp = await db.insert(users).values(data);
    return NextResponse.json({ message: "Contact created" }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: `Server error, ${e}` },
      { status: 500 }
    );
  }
}
