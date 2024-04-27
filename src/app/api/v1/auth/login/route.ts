"use server";

import db from "@/lib/mysql/db";
import { users } from "@/lib/mysql/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import * as jose from "jose";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  console.log(email, password);
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
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      id: user.id,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);
    nextcookies.set({
      name: "notan-credentials",
      value: token,
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
