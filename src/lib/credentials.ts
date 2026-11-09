export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export function asCredentialPair(
  email: unknown,
  password: unknown,
): { email: string; password: string } | null {
  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  return { email, password };
}
