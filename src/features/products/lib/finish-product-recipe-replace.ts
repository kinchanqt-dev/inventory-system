import { computeProductFoodCostCents } from "@/features/products/lib/compute-product-food-cost";
import { assertRecipeLineUnitsCompatible } from "@/features/products/lib/load-recipe-unit-lookup";
import {
  persistProductFoodCostCents,
  replaceProductRecipeLines,
} from "@/features/products/lib/replace-product-recipe";

import type { createClient } from "@/lib/supabase/server";
import type { ProductRecipeLineInput } from "@/features/products/schemas/recipe-line.schema";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface FinishProductRecipeReplaceInput {
  supabase: SupabaseClient;
  orgId: string;
  productId: string;
  org: {
    target_food_cost_bps?: number;
    sales_tax_bps?: number;
    prices_include_tax?: boolean;
  };
  product: {
    price_cents: number;
    portions_per_batch?: number;
    labor_cents?: number;
    packaging_cents?: number;
  };
  lines: ProductRecipeLineInput[];
}

export async function finishProductRecipeReplace(
  input: FinishProductRecipeReplaceInput,
) {
  const unitError = await assertRecipeLineUnitsCompatible(
    input.supabase,
    input.orgId,
    input.lines,
  );
  if (unitError) {
    return { error: unitError } as const;
  }

  const linesResult = await replaceProductRecipeLines(
    input.supabase,
    input.orgId,
    input.productId,
    input.lines,
  );
  if ("error" in linesResult) {
    return { error: linesResult.error } as const;
  }

  const foodCostCents = await computeProductFoodCostCents(
    input.org,
    input.product,
    input.lines,
  );
  if (foodCostCents === null) {
    return { success: true as const };
  }

  return await persistProductFoodCostCents(
    input.supabase,
    input.orgId,
    input.productId,
    foodCostCents,
  );
}