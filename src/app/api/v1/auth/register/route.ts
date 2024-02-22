"use server";

import db from "@/lib/mysql/db";
import { users } from "@/lib/mysql/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await db.query.users.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { email, ...others } = data;
  try {
    const existingUser = await db.query.users.findMany({
      where: (users, { eq }) => eq(users.email, email),
    });
    if (existingUser.length > 0)
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    //data["billing_address"] = sqlJSON.parse(data["billing_address"]);
    // data["payment_method"] = JSON.parse(data["payment_method"]);
    console.log(typeof data["payment_method"]);
    await db.execute(
      sql`INSERT INTO users(name, surname, avatar_url, billing_address, payment_method, email, password	)  values (${
        data["name"]
      }, ${data["surname"]}, ${data["avatar_url"]}, ${JSON.stringify(
        data["billing_address"]
      )}, ${JSON.stringify(data["payment_method"])}, ${data["email"]}, ${
        data["password"]
      })`
    );
    // await db.insert(users).values(data);
    return NextResponse.json({ message: `Contact created` }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { message: `Server error, ${e}` },
      { status: 500 }
    );
  }
}
