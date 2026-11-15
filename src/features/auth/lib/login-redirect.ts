import { redirect } from "next/navigation";

import { homePathForRole } from "@/enums";
import {
  emailIsPlatformAdminAllowlisted,
  isPlatformAdminUser,
} from "@/lib/platform-admin";
import {
  listUserOrganizations,
  setActiveOrganizationId,
} from "@/lib/session";

import type { User } from "@supabase/supabase-js";

function opensPlatformAdmin(user: User) {
  return (
    isPlatformAdminUser(user) || emailIsPlatformAdminAllowlisted(user.email)
  );
}

async function activateFirstOrganization(userId: string) {
  const memberships = await listUserOrganizations(userId);
  const first = memberships[0];
  if (!first) {
    return null;
  }
  await setActiveOrganizationId(first.organization.id);
  return first;
}

export async function redirectAfterLogin(user: User) {
  if (opensPlatformAdmin(user)) {
    await activateFirstOrganization(user.id);
    redirect("/admin");
  }

  const first = await activateFirstOrganization(user.id);
  if (first) {
    redirect(homePathForRole(first.role));
  }

  redirect("/onboarding");
}