import { firstZodIssueMessage } from "@/lib/first-zod-issue";

import {
  readProductFormData,
  toProductWriteData,
} from "@/features/products/lib/product-write-data";
import { productSchema } from "@/features/products/schemas/product.schema";

import type { createClient } from "@/lib/supabase/server";
import type { z } from "zod";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type ProductUpdateInput = z.infer<
  ReturnType<typeof productSchema.omit<{ quantity: true }>>
>;

export function parseProductUpdateFormData(formData: FormData) {
  const parsed = productSchema
    .omit({ quantity: true })
    .safeParse(readProductFormData(formData));

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid product"),
    } as const;
  }

  return { data: parsed.data } as const;
}

export async function loadProductImagePath(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
) {
  const { data: existing, error: existingError } = await supabase
    .from("products")
    .select("image_path")
    .eq("id", productId)
    .eq("organization_id", orgId)
    .maybeSingle();

  if (existingError || !existing) {
    return { error: "Could not update product." } as const;
  }

  return { imagePath: existing.image_path as string | null } as const;
}

export async function saveProductUpdate(
  supabase: SupabaseClient,
  orgId: string,
  productId: string,
  data: ProductUpdateInput,
  imagePath: string | null,
) {

  const { error: productError } = await supabase
    .from("products")
    .update({
      ...toProductWriteData(data),
      image_path: imagePath,
    })
    .eq("id", productId)
    .eq("organization_id", orgId);

  if (productError) {
    return { error: "Could not update product." } as const;
  }

  const { error: stockError } = await supabase
    .from("stock_items")
    .update({ reorder_level: data.reorderLevel })
    .eq("product_id", productId)
    .eq("organization_id", orgId);

  if (stockError) {
    return { error: "Could not update product." } as const;
  }

  return { success: true as const };
}