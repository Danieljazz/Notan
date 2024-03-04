"use server";
import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type JwtProps = {
  id: number;
  name: string;
};

export const verifyJwt = (): null | JwtProps => {
  const nextCookies = cookies();
  const jwtToken = nextCookies.get("notan-credentials");
  let decoded = null;
  try {
    decoded = jwt.verify(
      JSON.stringify(jwtToken),
      JSON.stringify(process.env.JWT_SECRET)
    ) as JwtProps;
  } catch (e) {
    return null;
  }
  return decoded?.id ? decoded : null;
};
