import type { Session } from "next-auth";

function userIsLoggedIn(auth: { user?: Session["user"] } | null) {
  return auth?.user != null;
}

function isLoginPath(pathname: string) {
  return pathname.startsWith("/login");
}

function denyAnonymousAccess(isLoggedIn: boolean, isLoginPage: boolean) {
  return !isLoggedIn && !isLoginPage;
}

function redirectLoggedInFromLogin(
  isLoggedIn: boolean,
  isLoginPage: boolean,
  request: { nextUrl: URL },
) {
  if (!isLoggedIn || !isLoginPage) {
    return null;
  }
  return Response.redirect(new URL("/", request.nextUrl));
}

export function evaluateAuthorized(
  auth: { user?: Session["user"] } | null,
  pathname: string,
  request: { nextUrl: URL },
) {
  const isLoggedIn = userIsLoggedIn(auth);
  const isLoginPage = isLoginPath(pathname);

  if (denyAnonymousAccess(isLoggedIn, isLoginPage)) {
    return false;
  }

  const redirect = redirectLoggedInFromLogin(isLoggedIn, isLoginPage, request);
  if (redirect) {
    return redirect;
  }

  return true;
}