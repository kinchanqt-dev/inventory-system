import {
  mapSaleRowsFallback,
  queryRecentSalesFallback,
} from "@/features/sales/lib/list-recent-sales-query";

import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function fetchRecentSalesFallback(
  supabase: SupabaseClient,
  orgId: string,
  limit: number,
) {
  const fallback = await queryRecentSalesFallback(supabase, orgId, limit);
  if (fallback.error) {
    throw new Error(fallback.error.message);
  }
  return mapSaleRowsFallback(fallback.data ?? []);
}