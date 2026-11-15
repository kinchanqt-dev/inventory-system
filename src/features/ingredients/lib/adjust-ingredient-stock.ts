import { nextStockQuantity } from "@/features/inventory/lib/next-stock-quantity";
import { requireQueryResult } from "@/lib/require-query-result";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface AdjustIngredientStockInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  ingredientId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason?: string;
}

function movementQuantityForType(
  type: AdjustIngredientStockInput["type"],
  updatedQuantity: number,
  quantity: number,
) {
  if (type === "ADJUST") {
    return updatedQuantity;
  }
  return quantity;
}

async function insertIngredientStockMovement(
  input: AdjustIngredientStockInput,
  unit: string,
  updatedQuantity: number,
) {
  const { error: movementError } = await input.supabase
    .from("ingredient_stock_movements")
    .insert({
      organization_id: input.orgId,
      ingredient_id: input.ingredientId,
      type: input.type,
      quantity: movementQuantityForType(
        input.type,
        updatedQuantity,
        input.quantity,
      ),
      unit,
      reason: input.reason ?? null,
      user_id: input.userId,
    });

  if (movementError) {
    throw new Error(movementError.message);
  }
}

export async function adjustIngredientStockRecord(
  input: AdjustIngredientStockInput,
) {
  const { data: stock, error: stockError } = await input.supabase
    .from("ingredient_stock")
    .select("*")
    .eq("ingredient_id", input.ingredientId)
    .eq("organization_id", input.orgId)
    .maybeSingle();

  const current = requireQueryResult(stock, stockError, "Stock record not found");
  const updatedQuantity = nextStockQuantity({
    currentQuantity: Number(current.quantity),
    type: input.type,
    quantity: input.quantity,
  });

  if (updatedQuantity < 0) {
    throw new Error("Insufficient stock for this adjustment");
  }

  const { error: updateError } = await input.supabase
    .from("ingredient_stock")
    .update({ quantity: updatedQuantity })
    .eq("ingredient_id", input.ingredientId)
    .eq("organization_id", input.orgId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  await insertIngredientStockMovement(input, current.unit, updatedQuantity);
}
