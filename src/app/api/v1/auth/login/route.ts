"use server";

import db from "@/lib/mysql/db";
import { users } from "@/lib/mysql/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, email)),
    });
    if (!user) {
      return NextResponse.json(
        { message: "Wrong credentials" },
        { status: 403 }
      );
    }
    const unHashedPassword = CryptoJS.AES.decrypt(
      user["password"],
      process.env.PA_SALT!
    );
    const decryptedData = unHashedPassword.toString(CryptoJS.enc.Utf8);
    if (decryptedData !== password)
      return NextResponse.json(
        { message: "Wrong credentials" },
        { status: 403 }
      );
    return NextResponse.json({
      message: { id: user.id, name: user.name },
    });
  } catch (e) {
    return NextResponse.json(
      { message: `Server error, ${e}` },
      { status: 500 }
    );
  }
}
