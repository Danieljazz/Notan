import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  const nextcookies = cookies();
  const jwtToken = nextcookies.get("notan-credentials");
};
