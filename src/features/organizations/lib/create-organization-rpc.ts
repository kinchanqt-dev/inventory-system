import { createClient } from "@/lib/supabase/server";

import { organizationInsertErrorMessage } from "@/features/organizations/lib/parse-create-organization";

interface CreateOrganizationValues {
  name: string;
  slug: string;
}

export async function createOrganizationViaRpc(values: CreateOrganizationValues) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_organization", {
    p_name: values.name,
    p_slug: values.slug,
    p_shop_title: values.name,
  });

  if (error) {
    return { error: organizationInsertErrorMessage(error) };
  }

  if (typeof data !== "string" || !data) {
    return { error: "Could not create business" };
  }

  return { organizationId: data };
}
