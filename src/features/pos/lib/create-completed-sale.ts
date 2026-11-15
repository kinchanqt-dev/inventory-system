import {
  insertSaleItems,
  insertSaleRecord,
} from "@/features/pos/lib/sale-insert";

import type { CreateCompletedSaleInput } from "@/features/pos/types/completed-sale.types";

export async function createCompletedSale(input: CreateCompletedSaleInput) {
  const createdSale = await insertSaleRecord(input);
  const insertedSaleItems = await insertSaleItems(input, createdSale.id);
  return { createdSale, insertedSaleItems };
}

export type { CreateCompletedSaleInput };
