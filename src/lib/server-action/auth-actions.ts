"use server";

import z from "zod";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { LoginSchema, RegisterSchema } from "../types";
import { cookies } from "next/headers";

export const loginUser = async ({
  email,
  password,
}: z.infer<typeof LoginSchema>) => {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signInWithPassword({ email, password });
  return response;
};

export const registerUser = async ({
  username,
  email,
  password,
}: z.infer<typeof RegisterSchema>) => {
  const supabase = createRouteHandlerClient({ cookies });
  const response = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username } },
  });
  return response;
};
