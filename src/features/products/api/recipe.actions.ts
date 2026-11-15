"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { finishProductRecipeReplace } from "@/features/products/lib/finish-product-recipe-replace";
import {
  fetchProductForRecipeCost,
  parseProductRecipeFormData,
} from "@/features/products/lib/replace-product-recipe";

function revalidateProductRecipePaths(productId: string) {
  revalidatePath("/products");
  revalidatePath(`/products/${productId}/edit`);
}

export async function replaceProductRecipeAction(
  productId: string,
  formData: FormData,
) {
  const session = await requireRole(["OWNER"]);
  const orgId = session.organization.id;

  const parsed = parseProductRecipeFormData(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const productResult = await fetchProductForRecipeCost(
    supabase,
    orgId,
    productId,
  );
  if ("error" in productResult) {
    return { error: productResult.error };
  }

  const saveResult = await finishProductRecipeReplace({
    supabase,
    orgId,
    productId,
    org: session.organization,
    product: productResult.product,
    lines: parsed.lines,
  });
  if ("error" in saveResult) {
    return { error: saveResult.error };
  }

  revalidateProductRecipePaths(productId);
  return { success: true };
}