import { mapSale } from "@/lib/mappers";

import type { createClient } from "@/lib/supabase/server";

import type { Sale } from "@/types/database.types";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type SaleRow = Sale & {
  profiles: { id: string; name: string } | null;
  sale_items: Array<{
    id: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
  }>;
};

export async function queryRecentSalesWithCashier(
  supabase: SupabaseClient,
  orgId: string,
  limit: number,
) {
  return await supabase
    .from("sales")
    .select("*, profiles!sales_cashier_id_fkey(id, name), sale_items(*)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export async function queryRecentSalesFallback(
  supabase: SupabaseClient,
  orgId: string,
  limit: number,
) {
  return await supabase
    .from("sales")
    .select("*, sale_items(*)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);
}

export function mapSaleRowsPrimary(data: SaleRow[]) {
  return data.map((row) => mapSale(row));
}

type FallbackSaleRow = Sale & {
  sale_items: SaleRow["sale_items"];
};

export function mapSaleRowsFallback(data: FallbackSaleRow[]) {
  return data.map((row) =>
    mapSale({ ...row, profiles: null, sale_items: row.sale_items }),
  );
}