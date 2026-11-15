import { slugifyOrgName } from "@/lib/org-cookie";
import { firstZodIssueMessage } from "@/lib/first-zod-issue";

import { createOrganizationSchema } from "@/features/organizations/schemas/create-organization.schema";

function formDataString(value: FormDataEntryValue | null) {
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function resolveOrganizationSlug(name: string, slugValue: string) {
  const rawSlug = slugValue.trim();
  if (rawSlug) {
    return rawSlug;
  }
  return slugifyOrgName(name);
}

export function parseCreateOrganizationFormData(formData: FormData) {
  const name = formDataString(formData.get("name"));
  const parsed = createOrganizationSchema.safeParse({
    name,
    slug: resolveOrganizationSlug(name, formDataString(formData.get("slug"))),
  });

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(
        parsed.error.issues,
        "Invalid business details",
      ),
    } as const;
  }

  return { data: parsed.data } as const;
}

export function organizationInsertErrorMessage(error: {
  code?: string;
  message: string;
}) {
  if (error.code === "23505") {
    return "That business URL is already taken. Try another slug.";
  }
  return error.message;
}
