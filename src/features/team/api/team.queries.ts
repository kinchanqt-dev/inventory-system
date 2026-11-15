import { createClient } from "@/lib/supabase/server";

import type { RoleValue } from "@/enums";
import type { TeamMember } from "@/features/team/types/team.types";

interface MemberRow {
  user_id: string;
  role: string;
  created_at: string;
}

interface MemberDetails {
  name: string;
  email: string | null;
}

type AdminClient = ReturnType<
  typeof import("@/lib/supabase/admin").createAdminClient
>;

function memberName(details: MemberDetails | undefined) {
  if (!details) {
    return "Staff";
  }
  return details.name;
}

function memberEmail(details: MemberDetails | undefined) {
  if (!details) {
    return null;
  }
  return details.email;
}

function toTeamMember(
  row: MemberRow,
  details: MemberDetails | undefined,
): TeamMember {
  return {
    userId: row.user_id,
    name: memberName(details),
    email: memberEmail(details),
    role: row.role as RoleValue,
    createdAt: row.created_at,
  };
}

function metaName(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  return "Staff";
}

function authUserName(
  current: MemberDetails | undefined,
  metadataName: unknown,
) {
  if (current) {
    return current.name;
  }
  return metaName(metadataName);
}

function authUserEmail(email: string | undefined) {
  if (!email) {
    return null;
  }
  return email;
}

async function mergeAuthUser(
  admin: AdminClient,
  userId: string,
  details: Map<string, MemberDetails>,
) {
  const { data } = await admin.auth.admin.getUserById(userId);
  const user = data.user;
  details.set(userId, {
    name: authUserName(details.get(userId), user?.user_metadata?.name),
    email: authUserEmail(user?.email),
  });
}

async function enrichWithAuthEmails(
  admin: AdminClient,
  userIds: string[],
  details: Map<string, MemberDetails>,
) {
  await Promise.all(
    userIds.map((userId) => mergeAuthUser(admin, userId, details)),
  );
}

function fillMissingAsStaff(
  userIds: string[],
  details: Map<string, MemberDetails>,
) {
  for (const userId of userIds) {
    details.set(userId, { name: "Staff", email: null });
  }
}

async function loadProfilesInto(
  admin: AdminClient,
  userIds: string[],
  details: Map<string, MemberDetails>,
) {
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, name")
    .in("id", userIds);

  for (const profile of profiles ?? []) {
    details.set(profile.id, { name: profile.name, email: null });
  }
}

async function loadMemberDetails(userIds: string[]) {
  const details = new Map<string, MemberDetails>();

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    await loadProfilesInto(admin, userIds, details);
    await enrichWithAuthEmails(admin, userIds, details);
  } catch {
    fillMissingAsStaff(userIds, details);
  }

  return details;
}

export async function listOrganizationMembers(
  organizationId: string,
): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select("user_id, role, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  if (rows.length === 0) {
    return [];
  }

  const detailsByUserId = await loadMemberDetails(rows.map((row) => row.user_id));
  return rows.map((row) => toTeamMember(row, detailsByUserId.get(row.user_id)));
}
