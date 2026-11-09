import { timingSafeEqual } from "node:crypto";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getBasicAuthCredentials() {
  const user = process.env.BASIC_AUTH_USER?.trim();
  const password = process.env.BASIC_AUTH_PASSWORD?.trim();

  if (!user || !password) {
    return null;
  }

  return { user, password };
}

export function isAuthorizedBasicAuth(header: string | null): boolean {
  const credentials = getBasicAuthCredentials();
  if (!credentials) {
    return true;
  }

  if (!header?.startsWith("Basic ")) {
    return false;
  }

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator <= 0) {
      return false;
    }

    const user = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    return (
      safeEqual(user, credentials.user) &&
      safeEqual(password, credentials.password)
    );
  } catch {
    return false;
  }
}

export function unauthorizedBasicResponse() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Inventory POS", charset="UTF-8"',
    },
  });
}
