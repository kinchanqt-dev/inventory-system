import { startOfDay } from "date-fns";

import { requireSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { assertNoQueryErrors } from "@/features/sales/lib/assert-query-results";
import { aggregateDashboardStats } from "@/features/sales/lib/dashboard-stats";
import { fetchRecentSalesFallback } from "@/features/sales/lib/fetch-recent-sales-fallback";
import {
  mapSaleRowsPrimary,
  queryRecentSalesWithCashier,
} from "@/features/sales/lib/list-recent-sales-query";

import type { Sale } from "@/types/database.types";

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

export async function listRecentSales(limit = 50) {
  const session = await requireSession();
  const supabase = await createClient();
  const orgId = session.organization.id;

  const { data, error } = await queryRecentSalesWithCashier(
    supabase,
    orgId,
    limit,
  );

  if (error) {
    return fetchRecentSalesFallback(supabase, orgId, limit);
  }

  return mapSaleRowsPrimary((data ?? []) as SaleRow[]);
}

export async function listSalesHistory(limit = 250) {
  return await listRecentSales(limit);
}

export async function getDashboardStats() {
  const session = await requireSession();
  const supabase = await createClient();
  const today = startOfDay(new Date()).toISOString();
  const orgId = session.organization.id;

  const [salesResult, stockResult, productResult] = await Promise.all([
    supabase
      .from("sales")
      .select("total_cents, payment_method")
      .eq("organization_id", orgId)
      .eq("status", "COMPLETED")
      .gte("created_at", today),
    supabase
      .from("stock_items")
      .select("quantity, reorder_level")
      .eq("organization_id", orgId),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("is_active", true),
  ]);

  assertNoQueryErrors(salesResult, stockResult);

  return aggregateDashboardStats(
    salesResult.data ?? [],
    stockResult.data ?? [],
    productResult.count ?? 0,
  );
}