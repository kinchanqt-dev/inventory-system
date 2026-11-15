import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface RecordStockMovementInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  productId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason: string;
}

function movementQuantity(
  type: RecordStockMovementInput["type"],
  requestedQuantity: number,
  updatedQuantity: number,
) {
  if (type === "ADJUST") {
    return updatedQuantity;
  }
  return requestedQuantity;
}

export async function recordStockMovement(
  input: RecordStockMovementInput,
  updatedQuantity: number,
) {
  const { error: movementError } = await input.supabase
    .from("stock_movements")
    .insert({
      organization_id: input.orgId,
      product_id: input.productId,
      type: input.type,
      quantity: movementQuantity(input.type, input.quantity, updatedQuantity),
      reason: input.reason,
      user_id: input.userId,
    });

  if (movementError) {
    return { error: movementError.message } as const;
  }
  return { success: true as const };
}