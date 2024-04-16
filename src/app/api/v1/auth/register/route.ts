"use server";

import db from "@/lib/mysql/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import cryptoJS from "crypto-js";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  const { email, password } = data;
  try {
    const existingUser = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (existingUser.length > 0)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    const saltedPass = cryptoJS.AES.encrypt(
      password,
      process.env.PA_SALT!
    ).toString();
    console.log(data["billing_address"]);
    await db.execute(
      sql`INSERT INTO users(name, surname, avatar_url, billing_address, payment_method, email, password	)  values (${
        data["name"]
      }, ${data["surname"]}, ${data["avatar_url"]}, ${JSON.stringify(
        data["billing_address"]
      )}, ${JSON.stringify(data["payment_method"])}, ${
        data["email"]
      }, ${saltedPass})`
    );
    return NextResponse.json({ message: `Contact created` }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: `Server error, ${e}` },
      { status: 500 }
    );
  }
}
