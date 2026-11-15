"use server";

import { revalidatePath } from "next/cache";

import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { performStockAdjust } from "@/features/inventory/lib/perform-stock-adjust";
import { stockAdjustSchema } from "@/features/inventory/schemas/stock-adjust.schema";

export async function adjustStockAction(formData: FormData) {
  const session = await requireRole(["OWNER"]);
  const orgId = session.organization.id;

  const parsed = stockAdjustSchema.safeParse({
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid adjustment"),
    };
  }

  const supabase = await createClient();
  const result = await performStockAdjust({
    supabase,
    orgId,
    userId: session.user.id,
    productId: parsed.data.productId,
    type: parsed.data.type,
    quantity: parsed.data.quantity,
    reason: parsed.data.reason,
  });

  if ("error" in result) {
    return { error: result.error };
  }

  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath("/pos");
  return { success: true };
}