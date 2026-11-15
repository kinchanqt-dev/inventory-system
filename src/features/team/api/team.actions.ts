"use server";

import { revalidatePath } from "next/cache";

import { errorMessageFromUnknown } from "@/lib/action-result";
import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { normalizeEmail } from "@/lib/credentials";
import { requireRole } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { createStaffSchema } from "@/features/team/schemas/create-staff.schema";

import type { RoleValue } from "@/enums";
import type { z } from "zod";

type CreateStaffValues = z.infer<typeof createStaffSchema>;
type ActionResult = { error?: string; success?: string };
type AdminClient = ReturnType<typeof createAdminClient>;
type OwnerSession = Awaited<ReturnType<typeof requireRole>>;

function serviceRoleMissingMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    return "Staff accounts need SUPABASE_SERVICE_ROLE_KEY in the server environment.";
  }
  return null;
}

function parseCreateStaffForm(formData: FormData) {
  return createStaffSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
}

function adminClientOrError():
  | { admin: AdminClient }
  | { error: string } {
  try {
    return { admin: createAdminClient() };
  } catch (error) {
    return {
      error:
        serviceRoleMissingMessage(error) ??
        errorMessageFromUnknown(error, "Could not create staff account"),
    };
  }
}

function createUserFailureMessage(errorMessage: string | undefined) {
  if (errorMessage) {
    return errorMessage;
  }
  return "Could not create staff account";
}

async function createAuthUser(
  admin: AdminClient,
  values: CreateStaffValues,
  email: string,
) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: values.password,
    email_confirm: true,
    user_metadata: { name: values.name },
  });

  if (error) {
    return { error: createUserFailureMessage(error.message) };
  }
  if (!data.user) {
    return { error: createUserFailureMessage(undefined) };
  }

  return { userId: data.user.id };
}

async function insertOrgMember(
  organizationId: string,
  userId: string,
  role: CreateStaffValues["role"],
) {
  const supabase = await createClient();
  const { error } = await supabase.from("organization_members").insert({
    organization_id: organizationId,
    user_id: userId,
    role,
  });
  return error?.message ?? null;
}

function staffCreatedMessage(values: CreateStaffValues, email: string) {
  const roleLabel = values.role === "COOK" ? "Cook" : "Cashier";
  return `${values.name} can sign in with ${email} as ${roleLabel}.`;
}

async function attachMemberOrRollback(
  admin: AdminClient,
  organizationId: string,
  userId: string,
  values: CreateStaffValues,
  email: string,
): Promise<ActionResult> {
  const memberError = await insertOrgMember(organizationId, userId, values.role);
  if (memberError) {
    await admin.auth.admin.deleteUser(userId);
    return { error: memberError };
  }

  revalidatePath("/team");
  return { success: staffCreatedMessage(values, email) };
}

async function createStaffWithAdmin(
  session: OwnerSession,
  admin: AdminClient,
  values: CreateStaffValues,
  email: string,
): Promise<ActionResult> {
  const created = await createAuthUser(admin, values, email);
  if ("error" in created) {
    return { error: created.error };
  }

  return attachMemberOrRollback(
    admin,
    session.organization.id,
    created.userId,
    values,
    email,
  );
}

async function createStaffFromValues(
  session: OwnerSession,
  values: CreateStaffValues,
): Promise<ActionResult> {
  const email = normalizeEmail(values.email);
  const adminResult = adminClientOrError();
  if ("error" in adminResult) {
    return { error: adminResult.error };
  }

  return createStaffWithAdmin(session, adminResult.admin, values, email);
}

export async function createStaffAction(
  _prevState: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireRole(["OWNER"]);
  const parsed = parseCreateStaffForm(formData);
  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid staff details"),
    };
  }

  return createStaffFromValues(session, parsed.data);
}

function memberRemovalBlockReason(
  member: { role: string } | null,
  lookupError: string | undefined,
) {
  if (lookupError) {
    return lookupError;
  }
  if (!member) {
    return "Team member not found";
  }
  if ((member.role as RoleValue) === "OWNER") {
    return "Owners cannot be removed here";
  }
  return null;
}

async function lookupRemovableMember(
  organizationId: string,
  userId: string,
  currentUserId: string,
) {
  if (userId === currentUserId) {
    return { error: "You cannot remove yourself" };
  }

  const supabase = await createClient();
  const { data: member, error } = await supabase
    .from("organization_members")
    .select("role")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .maybeSingle();

  const blockReason = memberRemovalBlockReason(member, error?.message);
  if (blockReason) {
    return { error: blockReason };
  }

  return { supabase };
}

export async function removeStaffAction(userId: string) {
  const session = await requireRole(["OWNER"]);
  const lookup = await lookupRemovableMember(
    session.organization.id,
    userId,
    session.user.id,
  );
  if ("error" in lookup) {
    return { error: lookup.error };
  }

  const { error } = await lookup.supabase
    .from("organization_members")
    .delete()
    .eq("organization_id", session.organization.id)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/team");
  return { success: true as const };
}
