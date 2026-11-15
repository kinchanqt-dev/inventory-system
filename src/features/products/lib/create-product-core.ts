import type { createClient } from "@/lib/supabase/server";

import { resolveProductImagePath } from "@/features/products/lib/resolve-product-image";
import { toProductWriteData } from "@/features/products/lib/product-write-data";

import { productSchema } from "@/features/products/schemas/product.schema";

import type { z } from "zod";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type ProductInput = z.infer<typeof productSchema>;

export async function insertProductWithStock(
  supabase: SupabaseClient,
  orgId: string,
  data: ProductInput,
) {
  const writeData = toProductWriteData(data);
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      organization_id: orgId,
      ...writeData,
    })
    .select("id")
    .single();

  if (error || !product) {
    return {
      error:
        "Could not create product. Item code or product code may already be in use.",
    } as const;
  }

  const { error: stockError } = await supabase.from("stock_items").insert({
    organization_id: orgId,
    product_id: product.id,
    quantity: data.quantity,
    reorder_level: data.reorderLevel,
  });

  if (stockError) {
    await supabase.from("products").delete().eq("id", product.id);
    return { error: stockError.message } as const;
  }

  return { productId: product.id } as const;
}

export async function attachProductImage(
  supabase: SupabaseClient,
  formData: FormData,
  orgId: string,
  productId: string,
) {
  const imageResult = await resolveProductImagePath(
    formData,
    orgId,
    productId,
    null,
  );
  if ("error" in imageResult) {
    return imageResult;
  }
  if (!imageResult.imagePath) {
    return { success: true as const };
  }
  await supabase
    .from("products")
    .update({ image_path: imageResult.imagePath })
    .eq("id", productId);
  return { success: true as const };
}