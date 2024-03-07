import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as jwt from "jsonwebtoken";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type JwtProps = {
  id: number;
  name: string;
};

export const verifyJwt = (token: String | undefined): null | JwtProps => {
  let decoded = null;
  try {
    decoded = jwt.verify(
      String(token),
      String(process.env.JWT_SECRET)
    ) as JwtProps;
  } catch (e) {
    console.log(e);
    return null;
  }
  return decoded?.id ? decoded : null;
};
