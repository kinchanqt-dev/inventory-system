import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface ApplyIngredientUsageInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  saleId: string;
  saleNumber: string;
  productName: string;
}

type IngredientUsageRow = {
  ingredientId: string;
  qtyInPackUnit: number;
  packUnit: string;
};

function buildStockUpdates(
  stockByIngredientId: Map<
    string,
    { id: string; quantity: number; ingredient_id: string }
  >,
  usage: IngredientUsageRow[],
  productName: string,
) {
  return usage.map((row) => {
    const stock = stockByIngredientId.get(row.ingredientId);
    if (!stock) {
      throw new Error(
        `Ingredient stock missing for recipe of ${productName}`,
      );
    }
    return {
      stockId: stock.id,
      nextQty: Number(stock.quantity) - row.qtyInPackUnit,
    };
  });
}

function assertNoUpdateErrors(
  updateResults: Array<{ error: { message: string } | null }>,
) {
  for (const { error: updateError } of updateResults) {
    if (updateError) {
      throw new Error(updateError.message);
    }
  }
}

async function applyStockQuantityUpdates(
  supabase: SupabaseClient,
  orgId: string,
  stockUpdates: Array<{ stockId: string; nextQty: number }>,
) {
  const updateResults = await Promise.all(
    stockUpdates.map(({ stockId, nextQty }) =>
      supabase
        .from("ingredient_stock")
        .update({ quantity: nextQty })
        .eq("id", stockId)
        .eq("organization_id", orgId),
    ),
  );
  assertNoUpdateErrors(updateResults);
}

async function insertSaleIngredientMovements(
  input: ApplyIngredientUsageInput,
  usage: IngredientUsageRow[],
) {
  const { error: movementError } = await input.supabase
    .from("ingredient_stock_movements")
    .insert(
      usage.map((row) => ({
        organization_id: input.orgId,
        ingredient_id: row.ingredientId,
        type: "SALE",
        quantity: row.qtyInPackUnit,
        unit: row.packUnit,
        reason: `Sale ${input.saleNumber}`,
        user_id: input.userId,
        sale_id: input.saleId,
      })),
    );

  if (movementError) {
    throw new Error(movementError.message);
  }
}

export async function applyIngredientUsage(
  input: ApplyIngredientUsageInput,
  usage: IngredientUsageRow[],
) {
  if (usage.length === 0) {
    return;
  }

  const ingredientIds = usage.map((row) => row.ingredientId);
  const { data: stocks, error: stockError } = await input.supabase
    .from("ingredient_stock")
    .select("id, quantity, ingredient_id")
    .eq("organization_id", input.orgId)
    .in("ingredient_id", ingredientIds);

  if (stockError) {
    throw new Error(stockError.message);
  }

  const stockByIngredientId = new Map(
    (stocks ?? []).map((stock) => [stock.ingredient_id, stock]),
  );

  const stockUpdates = buildStockUpdates(
    stockByIngredientId,
    usage,
    input.productName,
  );

  await applyStockQuantityUpdates(input.supabase, input.orgId, stockUpdates);
  await insertSaleIngredientMovements(input, usage);
}