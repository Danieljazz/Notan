import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as jose from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type JwtProps = {
  id: number;
  name: string;
};

export const verifyJwt = async (
  token: String | undefined
): Promise<null | JwtProps> => {
  let generateKey = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload }: { payload: JwtProps } = await jose.jwtVerify(
      String(token),
      generateKey
    );
    return payload?.id ? payload : null;
  } catch (e) {
    console.log("Error: ", e);
    return null;
  }
};
