import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid mail " }),
  password: z.string().describe("password").min(3, "Password is required"),
});

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .describe("username")
      .min(3, "Login should be longer than 3 characters."),
    email: z.string().describe("mail").email({ message: "Invalid mail" }),
    password: z.string().describe("password").min(3, "Password is required"),
    confirmPassword: z.string().describe("confirmPassword").min(3),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    password !== confirmPassword &&
      ctx.addIssue({
        code: "custom",
        message: "Passwords are different",
        path: ["confirmPassword"],
      });
  });
