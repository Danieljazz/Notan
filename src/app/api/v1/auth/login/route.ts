"use server";

import db from "@/lib/mysql/db";
import { users } from "@/lib/mysql/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const nextcookies = cookies();
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
    const cookie = jwt.sign(
      { id: user.id, name: user.name },
      String(process.env.JWT_SECRET),
      { algorithm: "HS256" }
    );
    nextcookies.set({
      name: "notan-credentials",
      value: cookie,
      httpOnly: true,
      secure: true,
    });
    return NextResponse.json({
      message: "User logged in properly",
    });
  } catch (e) {
    return NextResponse.json(
      { message: `Server error, ${e}` },
      { status: 500 }
    );
  }
}
