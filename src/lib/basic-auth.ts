import { timingSafeEqual } from "node:crypto";

import { parseBasicAuthHeader } from "@/lib/basic-auth-parse";

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

function credentialsMatch(
  parsed: { user: string; password: string },
  expected: { user: string; password: string },
) {
  return (
    safeEqual(parsed.user, expected.user) &&
    safeEqual(parsed.password, expected.password)
  );
}

export function isAuthorizedBasicAuth(header: string | null): boolean {
  const credentials = getBasicAuthCredentials();
  if (!credentials) {
    return true;
  }

  if (!header) {
    return false;
  }

  const parsed = parseBasicAuthHeader(header);
  if (!parsed) {
    return false;
  }

  return credentialsMatch(parsed, credentials);
}