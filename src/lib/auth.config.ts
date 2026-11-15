import type { NextAuthConfig } from "next-auth";

import { evaluateAuthorized } from "@/lib/auth-authorized";

import type { RoleValue } from "@/enums";

function toIdString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }
  return "";
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      return evaluateAuthorized(auth, request.nextUrl.pathname, request);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = toIdString(user.id);
        token.role = user.role as RoleValue;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = toIdString(token.id);
        session.user.role = token.role as RoleValue;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;