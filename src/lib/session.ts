import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { homePathForRole } from "@/enums";
import { ACTIVE_ORG_COOKIE } from "@/lib/org-cookie";
import {
  emailIsPlatformAdminAllowlisted,
  isPlatformAdminUser,
  PLATFORM_SUPPORT_ORG_COOKIE,
  platformAdminAppMetadata,
} from "@/lib/platform-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { OrgRole, Organization } from "@/types/database.types";
import type { User } from "@supabase/supabase-js";

export interface AppSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: OrgRole;
  };
  organization: Organization;
  isPlatformAdmin: boolean;
  isSupportMode: boolean;
}

export async function getAuthUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user;
}

export async function requireAuthUser() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requirePlatformAdmin() {
  const authUser = await requireAuthUser();
  const user = await ensurePlatformAdminMetadata(authUser);
  if (
    isPlatformAdminUser(user) ||
    emailIsPlatformAdminAllowlisted(user.email)
  ) {
    return user;
  }
  redirect("/");
}

function membershipFromRow(row: {
  role: string;
  organizations: Organization | Organization[] | null;
}) {
  const org = row.organizations;
  const organization = Array.isArray(org) ? org[0] : org;
  if (!organization) {
    return null;
  }
  return { role: row.role as OrgRole, organization };
}

export async function listUserOrganizations(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select("role, organizations(*)")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).flatMap((row) => {
    const membership = membershipFromRow(row);
    return membership ? [membership] : [];
  });
}

function pickActiveMembership(
  memberships: Array<{ role: OrgRole; organization: Organization }>,
  activeId: string | undefined,
) {
  const matched = memberships.find((m) => m.organization.id === activeId);
  if (matched) {
    return matched;
  }
  return memberships[0] ?? null;
}

async function loadOrganizationById(organizationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data as Organization | null;
}

async function getSupportOrganizationId() {
  const cookieStore = await cookies();
  return cookieStore.get(PLATFORM_SUPPORT_ORG_COOKIE)?.value ?? null;
}

export async function setSupportOrganizationId(organizationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(PLATFORM_SUPPORT_ORG_COOKIE, organizationId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4,
  });
}

export async function clearSupportOrganizationId() {
  const cookieStore = await cookies();
  cookieStore.set(PLATFORM_SUPPORT_ORG_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export async function resolveActiveOrganization(
  userId: string,
): Promise<{ role: OrgRole; organization: Organization } | null> {
  const memberships = await listUserOrganizations(userId);
  if (memberships.length === 0) {
    return null;
  }

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  return pickActiveMembership(memberships, activeId);
}

function metadataDisplayName(user: User): string | null {
  const metaName = user.user_metadata?.name;
  if (typeof metaName !== "string") {
    return null;
  }
  const trimmed = metaName.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function emailLocalPart(email: string) {
  const local = email.split("@")[0];
  return local.length > 0 ? local : "User";
}

function profileDisplayName(user: User) {
  const fromMetadata = metadataDisplayName(user);
  if (fromMetadata) {
    return fromMetadata;
  }
  if (user.email) {
    return emailLocalPart(user.email);
  }
  return "User";
}

export async function ensureUserProfile(user: User) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    return;
  }

  await supabase.from("profiles").insert({
    id: user.id,
    name: profileDisplayName(user),
  });
}

async function loadProfileName(userId: string, email: string | undefined) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.name) {
    return profile.name;
  }
  return email ?? "User";
}

async function resolveSupportOrganization(user: User) {
  if (!isPlatformAdminUser(user)) {
    return null;
  }

  const supportOrgId = await getSupportOrganizationId();
  if (!supportOrgId) {
    return null;
  }

  const organization = await loadOrganizationById(supportOrgId);
  if (!organization) {
    await clearSupportOrganizationId();
    return null;
  }

  return {
    role: "OWNER" as const,
    organization,
    isSupportMode: true as const,
  };
}

function redirectWhenMissingOrganization(platformAdmin: boolean): never {
  if (platformAdmin) {
    redirect("/admin");
  }
  redirect("/onboarding");
}

function redirectWhenOrganizationSuspended(
  organization: Organization,
  platformAdmin: boolean,
) {
  if (organization.status === "suspended" && !platformAdmin) {
    redirect("/login?error=org_suspended");
  }
}

async function sessionUserFields(user: User) {
  const name = await loadProfileName(user.id, user.email);
  return {
    id: user.id,
    email: user.email ?? "",
    name,
  };
}

async function sessionFromSupport(
  user: User,
  support: { role: OrgRole; organization: Organization },
  platformAdmin: boolean,
): Promise<AppSession> {
  const userFields = await sessionUserFields(user);
  return {
    user: { ...userFields, role: support.role },
    organization: support.organization,
    isPlatformAdmin: platformAdmin,
    isSupportMode: true,
  };
}

async function sessionFromMembership(
  user: User,
  platformAdmin: boolean,
): Promise<AppSession> {
  const active = await resolveActiveOrganization(user.id);
  if (!active) {
    redirectWhenMissingOrganization(platformAdmin);
  }
  redirectWhenOrganizationSuspended(active.organization, platformAdmin);
  const userFields = await sessionUserFields(user);
  return {
    user: { ...userFields, role: active.role },
    organization: active.organization,
    isPlatformAdmin: platformAdmin,
    isSupportMode: false,
  };
}

export async function requireSession(): Promise<AppSession> {
  const user = await requireAuthUser();
  const platformAdmin = isPlatformAdminUser(user);
  const support = await resolveSupportOrganization(user);

  if (support) {
    return sessionFromSupport(user, support, platformAdmin);
  }

  return sessionFromMembership(user, platformAdmin);
}

export async function requireRole(roles: OrgRole[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    redirect(homePathForRole(session.user.role));
  }
  return session;
}

export async function setActiveOrganizationId(organizationId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, organizationId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

function canPromoteToPlatformAdmin(user: User) {
  if (isPlatformAdminUser(user)) {
    return false;
  }
  if (!emailIsPlatformAdminAllowlisted(user.email)) {
    return false;
  }
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function promotePlatformAdminMetadata(user: User) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.updateUserById(user.id, {
    app_metadata: platformAdminAppMetadata(user.app_metadata),
  });
  if (error || !data.user) {
    return user;
  }
  const supabase = await createClient();
  await supabase.auth.refreshSession();
  return data.user;
}

export async function ensurePlatformAdminMetadata(user: User) {
  if (!canPromoteToPlatformAdmin(user)) {
    return user;
  }
  return promotePlatformAdminMetadata(user);
}
