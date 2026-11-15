import type { createClient } from "@/lib/supabase/server";

import type { z } from "zod";

import type { subRecipeSchema } from "@/features/sub-recipes/schemas/sub-recipe.schema";

type SubRecipeWriteData = z.infer<typeof subRecipeSchema>;

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function assertSubRecipeExists(
  supabase: SupabaseClient,
  orgId: string,
  subRecipeId: string,
) {
  const { data: existing, error: existingError } = await supabase
    .from("sub_recipes")
    .select("id")
    .eq("id", subRecipeId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (existingError || !existing) {
    return { error: "Could not update sub-recipe." } as const;
  }

  return { success: true as const };
}

export async function updateSubRecipeRecord(
  supabase: SupabaseClient,
  orgId: string,
  subRecipeId: string,
  data: SubRecipeWriteData,
) {
  const { error: updateError } = await supabase
    .from("sub_recipes")
    .update({
      name: data.name,
      batch_qty: data.batchQty,
      batch_unit: data.batchUnit,
      notes: data.notes || null,
    })
    .eq("id", subRecipeId)
    .eq("organization_id", orgId);

  if (updateError) {
    return {
      error: "Could not update sub-recipe. The name may already be in use.",
    } as const;
  }

  return { success: true as const };
}