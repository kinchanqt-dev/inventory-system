import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface LoadStockInput {
  supabase: SupabaseClient;
  orgId: string;
  productId: string;
}

export async function loadStockItem(input: LoadStockInput) {
  const { data: stock, error: stockError } = await input.supabase
    .from("stock_items")
    .select("*")
    .eq("product_id", input.productId)
    .eq("organization_id", input.orgId)
    .maybeSingle();

  if (stockError || !stock) {
    return { error: "Stock record not found" } as const;
  }

  return { stock } as const;
}