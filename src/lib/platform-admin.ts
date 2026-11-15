import { normalizeEmail } from "@/lib/credentials";

import type { User } from "@supabase/supabase-js";

const PLATFORM_ROLE_SUPER_ADMIN = "SUPER_ADMIN";
export const PLATFORM_SUPPORT_ORG_COOKIE = "platform_support_org_id";

export function isPlatformAdminUser(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }
  return user.app_metadata?.platform_role === PLATFORM_ROLE_SUPER_ADMIN;
}

function platformAdminEmailAllowlist(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => normalizeEmail(email))
    .filter((email) => email.length > 0);
}

export function emailIsPlatformAdminAllowlisted(
  email: string | null | undefined,
): boolean {
  if (!email) {
    return false;
  }
  const normalized = normalizeEmail(email);
  return platformAdminEmailAllowlist().includes(normalized);
}

export function platformAdminAppMetadata(
  existing: User["app_metadata"] | undefined,
) {
  return {
    ...existing,
    platform_role: PLATFORM_ROLE_SUPER_ADMIN,
  };
}
