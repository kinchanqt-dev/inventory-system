"use server";

import { revalidatePath } from "next/cache";

import { errorMessageFromUnknown } from "@/lib/action-result";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { adjustIngredientStockRecord } from "@/features/ingredients/lib/adjust-ingredient-stock";
import {
  parseAdjustIngredientStockForm,
  parseCreateIngredientForm,
  parseUpdateIngredientForm,
} from "@/features/ingredients/lib/parse-ingredient-action";
import {
  insertIngredientWithStock,
  updateIngredientWithStock,
} from "@/features/ingredients/lib/write-ingredient";

function revalidateIngredientPaths() {
  revalidatePath("/ingredients");
}

function actionError(error: unknown, fallback: string) {
  return { error: errorMessageFromUnknown(error, fallback) };
}

export async function createIngredientAction(formData: FormData) {
  try {
    const session = await requireRole(["OWNER"]);
    const data = parseCreateIngredientForm(formData);
    const supabase = await createClient();
    await insertIngredientWithStock(supabase, session.organization.id, data);
    revalidateIngredientPaths();
    return { success: true };
  } catch (error) {
    return actionError(error, "Could not create ingredient");
  }
}

export async function updateIngredientAction(
  ingredientId: string,
  formData: FormData,
) {
  try {
    const session = await requireRole(["OWNER"]);
    const data = parseUpdateIngredientForm(formData);
    const supabase = await createClient();
    await updateIngredientWithStock(
      supabase,
      session.organization.id,
      ingredientId,
      data,
    );
    revalidateIngredientPaths();
    return { success: true };
  } catch (error) {
    return actionError(error, "Could not update ingredient");
  }
}

export async function adjustIngredientStockAction(formData: FormData) {
  try {
    const session = await requireRole(["OWNER"]);
    const data = parseAdjustIngredientStockForm(formData);
    const supabase = await createClient();
    await adjustIngredientStockRecord({
      supabase,
      orgId: session.organization.id,
      userId: session.user.id,
      ...data,
    });
    revalidateIngredientPaths();
    return { success: true };
  } catch (error) {
    return actionError(error, "Could not adjust stock");
  }
}
