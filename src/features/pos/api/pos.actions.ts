"use server";

import { revalidatePath } from "next/cache";

import { errorMessageFromUnknown } from "@/lib/action-result";
import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { runCheckout } from "@/features/pos/lib/run-checkout";
import { checkoutSchema } from "@/features/pos/schemas/checkout.schema";

import type { CheckoutInput } from "@/features/pos/schemas/checkout.schema";

function revalidateCheckoutPaths() {
  revalidatePath("/pos");
  revalidatePath("/kitchen");
  revalidatePath("/ingredients");
  revalidatePath("/inventory");
  revalidatePath("/products");
  revalidatePath("/sales");
  revalidatePath("/");
}

async function loadCheckoutProducts(orgId: string, productIds: string[]) {
  const supabase = await createClient();
  const { data: productRows, error: productError } = await supabase
    .from("products")
    .select(
      "id, name, sku, price_cents, is_active, sends_to_kitchen, stock_items(quantity)",
    )
    .eq("organization_id", orgId)
    .eq("is_active", true)
    .in("id", productIds);

  if (productError) {
    throw new Error(productError.message);
  }

  return (productRows ?? []).map((row) => {
    const stockRaw = row.stock_items;
    const stock = Array.isArray(stockRaw) ? stockRaw[0] : stockRaw;
    return {
      id: row.id,
      name: row.name,
      sku: row.sku,
      priceCents: row.price_cents,
      sendsToKitchen: row.sends_to_kitchen ?? true,
      stock: stock ? { quantity: stock.quantity } : null,
    };
  });
}

export async function checkoutAction(input: CheckoutInput) {
  const session = await requireSession();
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(
        parsed.error.issues,
        "Could not complete the sale",
      ),
    };
  }

  try {
    const supabase = await createClient();
    const products = await loadCheckoutProducts(
      session.organization.id,
      parsed.data.items.map((item) => item.productId),
    );
    const sale = await runCheckout({
      supabase,
      orgId: session.organization.id,
      cashierId: session.user.id,
      products,
      parsed: parsed.data,
    });
    revalidateCheckoutPaths();
    return { success: true, sale };
  } catch (error) {
    return { error: errorMessageFromUnknown(error, "Checkout failed") };
  }
}
