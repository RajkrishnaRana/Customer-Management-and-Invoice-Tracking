import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

interface User {
  id: string;
  name: string;
  email: string;
  username: string; // Ensure this matches the required structure
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "john@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<User | null> {
        // 1️⃣ Check if email and password exist
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          throw new Error("Email and password are required");
        }

        // 2️⃣ Find user by email in the database
        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          console.error("No user found with this email");
          throw new Error("Invalid email or password");
        }

        // 3️⃣ Check if the password matches
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          console.error("Password does not match");
          throw new Error("Invalid email or password");
        }

        // 4️⃣ Return user object if successful
        return {
          id: `${existingUser.id}`,
          name: existingUser.username,
          email: existingUser.email,
          username: existingUser.username,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.username,
        };
      }

      return token;
    },
  },
};
