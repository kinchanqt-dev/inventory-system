import { nextStockQuantity } from "@/features/inventory/lib/next-stock-quantity";
import { recordStockMovement } from "@/features/inventory/lib/record-stock-movement";
import { loadStockItem } from "@/features/inventory/lib/load-stock-item";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface PerformStockAdjustInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: string;
}

async function applyStockQuantityUpdate(
  input: PerformStockAdjustInput,
  updatedQuantity: number,
) {
  const { error: updateError } = await input.supabase
    .from("stock_items")
    .update({ quantity: updatedQuantity })
    .eq("product_id", input.productId)
    .eq("organization_id", input.orgId);

  if (updateError) {
    return { error: updateError.message } as const;
  }

  return recordStockMovement(input, updatedQuantity);
}

export async function performStockAdjust(input: PerformStockAdjustInput) {
  const stockResult = await loadStockItem(input);
  if ("error" in stockResult) {
    return stockResult;
  }

  const updatedQuantity = nextStockQuantity({
    currentQuantity: stockResult.stock.quantity,
    type: input.type,
    quantity: input.quantity,
  });

  if (updatedQuantity < 0) {
    return { error: "Insufficient stock for this adjustment" } as const;
  }

  return applyStockQuantityUpdate(input, updatedQuantity);
}