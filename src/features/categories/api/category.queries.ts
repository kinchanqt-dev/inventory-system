import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import type { CategoryKind } from "@/types/database.types";
import type {
  CategoryListItem,
  CategoryOption,
} from "@/features/categories/types/category.types";

function asCategoryKind(value: string | null | undefined): CategoryKind {
  if (value === "ingredient") {
    return "ingredient";
  }
  return "menu";
}

export async function listCategories(
  kind?: CategoryKind,
): Promise<CategoryListItem[]> {
  const session = await requireSession();
  const supabase = await createClient();
  let query = supabase
    .from("categories")
    .select("id, name, slug, kind")
    .eq("organization_id", session.organization.id)
    .order("name");

  if (kind) {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: asCategoryKind(row.kind),
  }));
}

export async function listCategoryOptions(
  kind: CategoryKind,
): Promise<CategoryOption[]> {
  const categories = await listCategories(kind);
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}
