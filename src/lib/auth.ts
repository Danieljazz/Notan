import * as jose from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

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
