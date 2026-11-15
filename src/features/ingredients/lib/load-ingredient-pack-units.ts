import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function loadIngredientPackUnitsById(
  supabase: SupabaseClient,
  orgId: string,
  ingredientIds: string[],
) {
  if (ingredientIds.length === 0) {
    return new Map<string, string>();
  }

  const { data } = await supabase
    .from("ingredients")
    .select("id, pack_unit")
    .eq("organization_id", orgId)
    .in("id", ingredientIds);

  return new Map((data ?? []).map((row) => [row.id, row.pack_unit]));
}
