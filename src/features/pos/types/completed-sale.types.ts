import type { createClient } from "@/lib/supabase/server";

import type { CheckoutInput } from "@/features/pos/schemas/checkout.schema";

export type PosSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface CheckoutProduct {
  id: string;
  name: string;
  sku: string;
  priceCents: number;
}

export interface CreateCompletedSaleInput {
  supabase: PosSupabaseClient;
  orgId: string;
  cashierId: string;
  paymentMethod: CheckoutInput["paymentMethod"];
  paymentNote?: string;
  amountTenderedCents?: number;
  discountCents: number;
  subtotalCents: number;
  totalCents: number;
  changeCents: number | null;
  lineItems: Array<{
    product: CheckoutProduct;
    quantity: number;
    lineTotalCents: number;
  }>;
}
