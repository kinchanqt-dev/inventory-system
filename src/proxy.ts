import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";
import {
  getBasicAuthCredentials,
  isAuthorizedBasicAuth,
  unauthorizedBasicResponse,
} from "@/lib/basic-auth";

import type { NextAuthRequest } from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth((request: NextAuthRequest) => {
  if (
    getBasicAuthCredentials() &&
    !isAuthorizedBasicAuth(request.headers.get("authorization"))
  ) {
    return unauthorizedBasicResponse();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
