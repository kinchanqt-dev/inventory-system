"use server";

import { redirect } from "next/navigation";

import {
  requireAuthUser,
  setActiveOrganizationId,
} from "@/lib/session";

import { createOrganizationViaRpc } from "@/features/organizations/lib/create-organization-rpc";
import { parseCreateOrganizationFormData } from "@/features/organizations/lib/parse-create-organization";

export async function createOrganizationAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  await requireAuthUser();

  const parsed = parseCreateOrganizationFormData(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const created = await createOrganizationViaRpc(parsed.data);
  if ("error" in created) {
    return { error: created.error };
  }

  await setActiveOrganizationId(created.organizationId);
  redirect("/");
}
