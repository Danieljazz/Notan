import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: { email: { label: "Username", type: "text" }, password: {} },
      async authorize(credentials) {
        redirect("/site");
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
