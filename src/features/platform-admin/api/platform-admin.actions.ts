"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { errorMessageFromUnknown } from "@/lib/action-result";
import {
  clearSupportOrganizationId,
  requirePlatformAdmin,
  setSupportOrganizationId,
} from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";

import { writePlatformAuditLog } from "@/features/platform-admin/lib/write-audit-log";

import type { OrganizationStatus } from "@/types/database.types";

function revalidateAdminPaths(organizationId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/organizations");
  revalidatePath("/admin/users");
  revalidatePath("/admin/audit");
  if (organizationId) {
    revalidatePath(`/admin/organizations/${organizationId}`);
  }
}

export async function setOrganizationStatusAction(
  organizationId: string,
  status: OrganizationStatus,
) {
  const actor = await requirePlatformAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("organizations")
    .update({ status })
    .eq("id", organizationId);

  if (error) {
    throw new Error(error.message);
  }

  await writePlatformAuditLog({
    actorUserId: actor.id,
    action: status === "suspended" ? "org.suspend" : "org.reactivate",
    targetType: "organization",
    targetId: organizationId,
    metadata: { status },
  });

  revalidateAdminPaths(organizationId);
}

export async function enterOrganizationSupportAction(organizationId: string) {
  const actor = await requirePlatformAdmin();
  const admin = createAdminClient();
  const { data: organization, error } = await admin
    .from("organizations")
    .select("id, name")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!organization) {
    throw new Error("Organization not found");
  }

  await setSupportOrganizationId(organizationId);
  await writePlatformAuditLog({
    actorUserId: actor.id,
    action: "org.enter_support",
    targetType: "organization",
    targetId: organizationId,
    metadata: { name: organization.name },
  });

  redirect("/");
}

export async function exitOrganizationSupportAction() {
  const actor = await requirePlatformAdmin();
  await clearSupportOrganizationId();
  await writePlatformAuditLog({
    actorUserId: actor.id,
    action: "org.exit_support",
    targetType: "organization",
    targetId: null,
  });
  redirect("/admin");
}

export async function setUserBannedAction(userId: string, banned: boolean) {
  const actor = await requirePlatformAdmin();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    ban_duration: banned ? "876000h" : "none",
  });

  if (error) {
    throw new Error(error.message);
  }

  await writePlatformAuditLog({
    actorUserId: actor.id,
    action: banned ? "user.ban" : "user.unban",
    targetType: "user",
    targetId: userId,
  });

  revalidateAdminPaths();
}

export async function generateUserRecoveryLinkAction(userId: string) {
  try {
    const actor = await requirePlatformAdmin();
    const email = await loadUserEmail(userId);
    const actionLink = await createRecoveryActionLink(email);

    await writePlatformAuditLog({
      actorUserId: actor.id,
      action: "user.generate_recovery_link",
      targetType: "user",
      targetId: userId,
      metadata: { email },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/audit");
    return { success: true as const, actionLink };
  } catch (error) {
    return {
      error: errorMessageFromUnknown(error, "Could not generate recovery link"),
    };
  }
}

async function loadUserEmail(userId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.getUserById(userId);
  if (error) {
    throw new Error(error.message);
  }
  if (!data.user?.email) {
    throw new Error("User email not found");
  }
  return data.user.email;
}

async function createRecoveryActionLink(email: string) {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  if (error) {
    throw new Error(error.message);
  }
  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    throw new Error("Could not generate recovery link");
  }
  return actionLink;
}
