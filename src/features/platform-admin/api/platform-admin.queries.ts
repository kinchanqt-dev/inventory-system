import { createAdminClient } from "@/lib/supabase/admin";

import { throwIfError } from "@/features/platform-admin/lib/throw-if-error";

import type {
  Organization,
  OrganizationStatus,
  PlatformAuditLog,
} from "@/types/database.types";

export interface PlatformOrgListItem {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  createdAt: string;
  memberCount: number;
}

export interface PlatformDashboardStats {
  orgCount: number;
  suspendedCount: number;
  userCount: number;
  recentAudit: PlatformAuditLog[];
}

async function countOrganizations(status?: OrganizationStatus) {
  const admin = createAdminClient();
  let query = admin
    .from("organizations")
    .select("id", { count: "exact", head: true });
  if (status) {
    query = query.eq("status", status);
  }
  const { count, error } = await query;
  throwIfError(error);
  return count ?? 0;
}

async function countProfiles() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });
  throwIfError(error);
  return count ?? 0;
}

export async function getPlatformDashboardStats(): Promise<PlatformDashboardStats> {
  const admin = createAdminClient();
  const [orgCount, suspendedCount, userCount, auditResult] = await Promise.all([
    countOrganizations(),
    countOrganizations("suspended"),
    countProfiles(),
    admin
      .from("platform_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  throwIfError(auditResult.error);

  return {
    orgCount,
    suspendedCount,
    userCount,
    recentAudit: (auditResult.data ?? []) as PlatformAuditLog[],
  };
}

function incrementCount(counts: Map<string, number>, key: string) {
  const current = counts.get(key);
  if (current === undefined) {
    counts.set(key, 1);
    return;
  }
  counts.set(key, current + 1);
}

async function memberCountsByOrgIds(ids: string[]) {
  const counts = new Map<string, number>();
  if (ids.length === 0) {
    return counts;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("organization_members")
    .select("organization_id")
    .in("organization_id", ids);
  throwIfError(error);

  for (const member of data ?? []) {
    incrementCount(counts, member.organization_id);
  }
  return counts;
}

export async function listPlatformOrganizations(
  query = "",
): Promise<PlatformOrgListItem[]> {
  const admin = createAdminClient();
  const normalized = query.trim().toLowerCase();

  let orgQuery = admin
    .from("organizations")
    .select("id, name, slug, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (normalized) {
    orgQuery = orgQuery.or(
      `name.ilike.%${normalized}%,slug.ilike.%${normalized}%`,
    );
  }

  const { data: orgs, error } = await orgQuery;
  throwIfError(error);

  const rows = orgs ?? [];
  const counts = await memberCountsByOrgIds(rows.map((org) => org.id));

  return rows.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    status: (org.status ?? "active") as OrganizationStatus,
    createdAt: org.created_at,
    memberCount: counts.get(org.id) ?? 0,
  }));
}

export interface PlatformOrgDetail {
  organization: Organization;
  members: Array<{
    id: string;
    userId: string;
    role: string;
    name: string;
    email: string;
  }>;
  salesCount: number;
}

async function loadMemberProfiles(
  userIds: string[],
): Promise<Map<string, { name: string; email: string }>> {
  const profileById = new Map<string, { name: string; email: string }>();
  if (userIds.length === 0) {
    return profileById;
  }

  const admin = createAdminClient();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, name")
    .in("id", userIds);
  throwIfError(error);

  for (const profile of profiles ?? []) {
    profileById.set(profile.id, { name: profile.name, email: "" });
  }

  await Promise.all(
    userIds.map(async (userId) => {
      const { data } = await admin.auth.admin.getUserById(userId);
      const existing = profileById.get(userId) ?? { name: "User", email: "" };
      profileById.set(userId, {
        name: existing.name,
        email: data.user?.email ?? "",
      });
    }),
  );

  return profileById;
}

export async function getPlatformOrganization(
  organizationId: string,
): Promise<PlatformOrgDetail | null> {
  const admin = createAdminClient();

  const { data: organization, error } = await admin
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .maybeSingle();
  throwIfError(error);
  if (!organization) {
    return null;
  }

  const [membersResult, salesResult] = await Promise.all([
    admin
      .from("organization_members")
      .select("id, user_id, role")
      .eq("organization_id", organizationId),
    admin
      .from("sales")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId),
  ]);
  throwIfError(membersResult.error);
  throwIfError(salesResult.error);

  const members = membersResult.data ?? [];
  const profileById = await loadMemberProfiles(
    members.map((member) => member.user_id),
  );

  return {
    organization: organization as Organization,
    members: members.map((member) =>
      toOrgMemberView(member, profileById.get(member.user_id)),
    ),
    salesCount: salesResult.count ?? 0,
  };
}

function toOrgMemberView(
  member: { id: string; user_id: string; role: string },
  profile: { name: string; email: string } | undefined,
) {
  return {
    id: member.id,
    userId: member.user_id,
    role: member.role,
    name: profile ? profile.name : "User",
    email: profile ? profile.email : "",
  };
}

export interface PlatformUserLookup {
  id: string;
  email: string;
  name: string;
  bannedUntil: string | null;
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    role: string;
    status: OrganizationStatus;
  }>;
}

function membershipOrganizations(
  memberships: Array<{
    role: string;
    organizations:
      | {
          id: string;
          name: string;
          slug: string;
          status: OrganizationStatus;
        }
      | {
          id: string;
          name: string;
          slug: string;
          status: OrganizationStatus;
        }[]
      | null;
  }>,
) {
  return memberships.flatMap((row) => {
    const org = row.organizations;
    const organization = Array.isArray(org) ? org[0] : org;
    if (!organization) {
      return [];
    }
    return [
      {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        role: row.role,
        status: organization.status ?? "active",
      },
    ];
  });
}

async function findAuthUserByEmail(normalized: string) {
  const admin = createAdminClient();
  const { data: listed, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  throwIfError(error);

  return (
    (listed.users ?? []).find(
      (entry) => entry.email?.toLowerCase() === normalized,
    ) ?? null
  );
}

function displayUserName(
  profileName: string | null | undefined,
  metadataName: unknown,
) {
  if (profileName) {
    return profileName;
  }
  if (typeof metadataName === "string" && metadataName.length > 0) {
    return metadataName;
  }
  return "User";
}

async function loadUserMembershipBundle(userId: string) {
  const admin = createAdminClient();
  const [{ data: profile }, membershipsResult] = await Promise.all([
    admin.from("profiles").select("name").eq("id", userId).maybeSingle(),
    admin
      .from("organization_members")
      .select("role, organizations(id, name, slug, status)")
      .eq("user_id", userId),
  ]);
  throwIfError(membershipsResult.error);
  return {
    profileName: profile?.name as string | undefined,
    organizations: membershipOrganizations(membershipsResult.data ?? []),
  };
}

function bannedUntilValue(user: { banned_until?: string | null }) {
  if (user.banned_until) {
    return user.banned_until;
  }
  return null;
}

function toPlatformUserLookup(
  user: {
    id: string;
    email?: string;
    user_metadata?: { name?: unknown };
    banned_until?: string | null;
  },
  normalized: string,
  bundle: Awaited<ReturnType<typeof loadUserMembershipBundle>>,
): PlatformUserLookup {
  return {
    id: user.id,
    email: user.email ? user.email : normalized,
    name: displayUserName(bundle.profileName, user.user_metadata?.name),
    bannedUntil: bannedUntilValue(user),
    organizations: bundle.organizations,
  };
}

export async function lookupPlatformUserByEmail(
  email: string,
): Promise<PlatformUserLookup | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const user = await findAuthUserByEmail(normalized);
  if (!user) {
    return null;
  }

  const bundle = await loadUserMembershipBundle(user.id);
  return toPlatformUserLookup(user, normalized, bundle);
}

export async function listPlatformAuditLogs(
  limit = 50,
): Promise<PlatformAuditLog[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("platform_audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  throwIfError(error);
  return (data ?? []) as PlatformAuditLog[];
}
