import {
  toIngredientWriteData,
} from "@/features/ingredients/lib/ingredient-form-data";
import { requireQueryResult } from "@/lib/require-query-result";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type IngredientWriteInput = Parameters<typeof toIngredientWriteData>[0] & {
  minStock: number;
  packUnit: string;
  initialStock?: number;
};

export async function insertIngredientWithStock(
  supabase: SupabaseClient,
  orgId: string,
  data: IngredientWriteInput,
) {
  const writeData = toIngredientWriteData(data);
  const { data: ingredient, error } = await supabase
    .from("ingredients")
    .insert({ organization_id: orgId, ...writeData })
    .select("id")
    .single();

  const created = requireQueryResult(
    ingredient,
    error,
    "Could not create ingredient. The name may already be in use.",
  );

  const { error: stockError } = await supabase.from("ingredient_stock").insert({
    organization_id: orgId,
    ingredient_id: created.id,
    quantity: data.initialStock,
    unit: data.packUnit,
    min_stock: data.minStock,
  });

  if (stockError) {
    await supabase.from("ingredients").delete().eq("id", created.id);
    throw new Error(stockError.message);
  }

  return created;
}

export async function updateIngredientWithStock(
  supabase: SupabaseClient,
  orgId: string,
  ingredientId: string,
  data: IngredientWriteInput,
) {
  const { data: existing, error: existingError } = await supabase
    .from("ingredients")
    .select("pack_price_cents")
    .eq("id", ingredientId)
    .eq("organization_id", orgId)
    .maybeSingle();

  const current = requireQueryResult(
    existing,
    existingError,
    "Could not update ingredient.",
  );

  const writeData = toIngredientWriteData(data);
  const priceHistory =
    current.pack_price_cents === writeData.pack_price_cents
      ? {}
      : { previous_pack_price_cents: current.pack_price_cents };

  const { error: ingredientError } = await supabase
    .from("ingredients")
    .update({ ...writeData, ...priceHistory })
    .eq("id", ingredientId)
    .eq("organization_id", orgId);

  if (ingredientError) {
    throw new Error("Could not update ingredient.");
  }

  const { error: stockError } = await supabase
    .from("ingredient_stock")
    .update({
      min_stock: data.minStock,
      unit: data.packUnit,
    })
    .eq("ingredient_id", ingredientId)
    .eq("organization_id", orgId);

  if (stockError) {
    throw new Error("Could not update ingredient.");
  }
}
