import type { createClient } from "@/lib/supabase/server";

import { deductRecipeIngredientStock } from "@/features/pos/lib/deduct-recipe-stock";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface CheckoutLineProduct {
  id: string;
  name: string;
  priceCents: number;
}

interface DeductCheckoutStockInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  saleId: string;
  saleNumber: string;
  lineItems: Array<{ product: CheckoutLineProduct; quantity: number }>;
}

interface FinishedGoodsDeductionInput {
  supabase: SupabaseClient;
  orgId: string;
  userId: string;
  saleId: string;
  saleNumber: string;
  product: CheckoutLineProduct;
  quantity: number;
}

async function readFinishedGoodsQuantity(
  supabase: SupabaseClient,
  orgId: string,
  product: CheckoutLineProduct,
) {
  const { data: stock, error } = await supabase
    .from("stock_items")
    .select("quantity")
    .eq("product_id", product.id)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!stock) {
    throw new Error(`Stock missing for ${product.name}`);
  }

  return stock.quantity as number;
}

async function writeFinishedGoodsQuantity(
  input: FinishedGoodsDeductionInput,
  nextQuantity: number,
) {
  // Prefer select() so a 0-row update (RLS / bad filter) cannot look like success.
  const { data, error } = await input.supabase
    .from("stock_items")
    .update({ quantity: nextQuantity })
    .eq("product_id", input.product.id)
    .eq("organization_id", input.orgId)
    .select("quantity")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error(`Could not update stock for ${input.product.name}`);
  }
}

async function recordFinishedGoodsSaleMovement(
  input: FinishedGoodsDeductionInput,
) {
  const { error } = await input.supabase.from("stock_movements").insert({
    organization_id: input.orgId,
    product_id: input.product.id,
    type: "SALE",
    quantity: input.quantity,
    reason: `Sale ${input.saleNumber}`,
    user_id: input.userId,
    sale_id: input.saleId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function deductFinishedGoodsStock(input: FinishedGoodsDeductionInput) {
  const currentQuantity = await readFinishedGoodsQuantity(
    input.supabase,
    input.orgId,
    input.product,
  );

  if (currentQuantity < input.quantity) {
    throw new Error(`Not enough stock for ${input.product.name}`);
  }

  await writeFinishedGoodsQuantity(input, currentQuantity - input.quantity);
  await recordFinishedGoodsSaleMovement(input);
}

async function deductLineStock(
  input: DeductCheckoutStockInput,
  product: CheckoutLineProduct,
  quantity: number,
) {
  // Always reduce sellable product stock (POS / Products pages), then recipe BOM.
  await deductFinishedGoodsStock({
    supabase: input.supabase,
    orgId: input.orgId,
    userId: input.userId,
    saleId: input.saleId,
    saleNumber: input.saleNumber,
    product,
    quantity,
  });

  await deductRecipeIngredientStock({
    supabase: input.supabase,
    orgId: input.orgId,
    userId: input.userId,
    saleId: input.saleId,
    saleNumber: input.saleNumber,
    productId: product.id,
    productName: product.name,
    quantitySold: quantity,
  });
}

export async function deductCheckoutStock(input: DeductCheckoutStockInput) {
  await Promise.all(
    input.lineItems.map(({ product, quantity }) =>
      deductLineStock(input, product, quantity),
    ),
  );
}
