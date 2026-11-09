import type { NextAuthConfig } from "next-auth";

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
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const isLoginPage = pathname.startsWith("/login");

      if (!isLoggedIn && !isLoginPage) {
        return false;
      }

      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return true;
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
