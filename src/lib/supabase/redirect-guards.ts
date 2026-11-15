import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/login", "/register", "/auth"];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

function redirectAuthenticatedHome(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
}

function isAuthEntryPath(pathname: string) {
  return pathname === "/login" || pathname === "/register";
}

export function authRedirectForRequest(
  request: NextRequest,
  user: unknown,
  pathname: string,
): NextResponse | null {
  if (!user) {
    if (isPublicPath(pathname)) {
      return null;
    }
    return redirectToLogin(request, pathname);
  }

  if (isAuthEntryPath(pathname)) {
    return redirectAuthenticatedHome(request);
  }

  return null;
}
