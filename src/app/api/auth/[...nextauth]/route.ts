import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        const response = await fetch(
          "http://localhost:3000/api/v1/auth/login",
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await response.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async redirect() {
      return "http://localhost:3000/site";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
