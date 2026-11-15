import { compare } from "bcryptjs";

import { asCredentialPair, normalizeEmail } from "@/lib/credentials";
import { prisma } from "@/lib/prisma";

import type { RoleValue } from "@/enums";

async function userMatchingPassword(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

function sessionUser(user: NonNullable<Awaited<ReturnType<typeof userMatchingPassword>>>) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as RoleValue,
  };
}

async function authorizeCredentialPair(
  email: unknown,
  password: unknown,
) {
  const pair = asCredentialPair(email, password);
  if (!pair) {
    return null;
  }

  const user = await userMatchingPassword(pair.email, pair.password);
  if (!user) {
    return null;
  }

  return sessionUser(user);
}

export async function authorizeCredentials(credentials: {
  email?: unknown;
  password?: unknown;
} | null) {
  if (credentials == null) {
    return authorizeCredentialPair(undefined, undefined);
  }
  return authorizeCredentialPair(credentials.email, credentials.password);
}