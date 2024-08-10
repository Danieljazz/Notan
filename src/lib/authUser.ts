"use client";
import { cookies } from "next/headers";
import { verifyJwt } from "./auth";
import { NextResponse } from "next/server";

export const authUser = async () => {
  const jwtToken = cookies().get("notan-credentials")?.value;
  const decodedToken = await verifyJwt(jwtToken);
  if (!decodedToken)
    return NextResponse.json(
      { message: "Unathoritized user!" },
      { status: 403 }
    );
  // return verifyJwt(jwtToken)
  // .then((token) => token)
  // .catch(() =>
  //   NextResponse.json({ message: "Unathoritized user!" }, { status: 403 })
  // );
};
