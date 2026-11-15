import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { categoryErrorMessage } from "@/features/categories/lib/category-error-message";
import { slugifyCategoryName } from "@/features/categories/lib/slugify-category";
import { categorySchema } from "@/features/categories/schemas/category.schema";

import type { CategoryInput } from "@/features/categories/schemas/category.schema";

type OwnerSession = Awaited<ReturnType<typeof requireRole>>;
type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type CategoryWriteContext =
  | { error: string }
  | { session: OwnerSession; data: CategoryInput; supabase: SupabaseClient };

function parseCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
  });
}

export async function prepareCategoryWrite(
  formData: FormData,
): Promise<CategoryWriteContext> {
  const session = await requireRole(["OWNER"]);
  const parsed = parseCategoryForm(formData);
  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid category"),
    };
  }

  return {
    session,
    data: parsed.data,
    supabase: await createClient(),
  };
}

export function categoryRowPayload(data: CategoryInput) {
  return {
    name: data.name,
    slug: slugifyCategoryName(data.name),
    kind: data.kind,
  };
}

export function categoryWriteFailure(
  error: { code?: string; message: string } | null,
  fallback: string,
) {
  if (!error) {
    return null;
  }
  return categoryErrorMessage(error, fallback);
}
