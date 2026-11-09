import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/lib/auth.config";
import { asCredentialPair, normalizeEmail } from "@/lib/credentials";
import { prisma } from "@/lib/prisma";

import type { RoleValue } from "@/enums";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const pair = asCredentialPair(credentials?.email, credentials?.password);

        if (!pair) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: normalizeEmail(pair.email) },
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(pair.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as RoleValue,
        };
      },
    }),
  ],
});
