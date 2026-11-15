import { buildSaleRecordRow } from "@/features/pos/lib/sale-record-row";

import type { CreateCompletedSaleInput } from "@/features/pos/types/completed-sale.types";

function toSaleItemRows(input: CreateCompletedSaleInput, saleId: string) {
  return input.lineItems.map(({ product, quantity, lineTotalCents }) => ({
    organization_id: input.orgId,
    sale_id: saleId,
    product_id: product.id,
    product_name: product.name,
    product_sku: product.sku,
    quantity,
    unit_price_cents: product.priceCents,
    line_total_cents: lineTotalCents,
    food_cost_cents: 0,
    line_note: null,
  }));
}

function saleInsertError(message: string | undefined, fallback: string): never {
  throw new Error(message ?? fallback);
}

export async function insertSaleRecord(input: CreateCompletedSaleInput) {
  const { data: createdSale, error: saleError } = await input.supabase
    .from("sales")
    .insert(buildSaleRecordRow(input))
    .select(
      "id, sale_number, subtotal_cents, discount_cents, total_cents, payment_method, payment_note, amount_tendered_cents, change_cents, created_at",
    )
    .single();

  if (saleError || !createdSale) {
    saleInsertError(saleError?.message, "Could not create sale");
  }

  return createdSale!;
}

export async function insertSaleItems(
  input: CreateCompletedSaleInput,
  saleId: string,
) {
  const { data: insertedSaleItems, error: itemsError } = await input.supabase
    .from("sale_items")
    .insert(toSaleItemRows(input, saleId))
    .select(
      "id, product_id, product_name, product_sku, quantity, unit_price_cents, line_total_cents, line_note",
    );

  if (itemsError || !insertedSaleItems) {
    saleInsertError(itemsError?.message, "Could not save sale items");
  }

  return insertedSaleItems!;
}
