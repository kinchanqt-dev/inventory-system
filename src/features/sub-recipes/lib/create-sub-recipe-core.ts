import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface CreateSubRecipeInput {
  name: string;
  batchQty: number;
  batchUnit: string;
  notes?: string;
  lines: Array<{ ingredientId: string; qty: number; unit: string }>;
}

export async function insertSubRecipeRecord(
  supabase: SupabaseClient,
  orgId: string,
  data: CreateSubRecipeInput,
) {
  const { data: subRecipe, error } = await supabase
    .from("sub_recipes")
    .insert({
      organization_id: orgId,
      name: data.name,
      batch_qty: data.batchQty,
      batch_unit: data.batchUnit,
      notes: data.notes || null,
    })
    .select("id")
    .single();

  if (error || !subRecipe) {
    return {
      error:
        "Could not create sub-recipe. The name may already be in use." as const,
    };
  }

  return { subRecipe };
}
