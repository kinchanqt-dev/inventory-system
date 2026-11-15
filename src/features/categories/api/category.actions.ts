"use server";

import { revalidatePath } from "next/cache";

import { errorMessageFromUnknown } from "@/lib/action-result";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import {
  categoryRowPayload,
  categoryWriteFailure,
  prepareCategoryWrite,
} from "@/features/categories/lib/category-write";

type ActionResult = { error?: string; success?: boolean };

function revalidateCategoryPaths() {
  revalidatePath("/categories");
  revalidatePath("/products");
  revalidatePath("/products/new");
  revalidatePath("/ingredients");
  revalidatePath("/ingredients/new");
}

export async function createCategoryAction(
  _prevState: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const prepared = await prepareCategoryWrite(formData);
    if ("error" in prepared) {
      return { error: prepared.error };
    }

    const { error } = await prepared.supabase.from("categories").insert({
      organization_id: prepared.session.organization.id,
      ...categoryRowPayload(prepared.data),
    });

    const failure = categoryWriteFailure(error, "Could not create category");
    if (failure) {
      return { error: failure };
    }

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    return {
      error: errorMessageFromUnknown(error, "Could not create category"),
    };
  }
}

export async function updateCategoryAction(
  categoryId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const prepared = await prepareCategoryWrite(formData);
    if ("error" in prepared) {
      return { error: prepared.error };
    }

    const { error } = await prepared.supabase
      .from("categories")
      .update(categoryRowPayload(prepared.data))
      .eq("id", categoryId)
      .eq("organization_id", prepared.session.organization.id);

    const failure = categoryWriteFailure(error, "Could not update category");
    if (failure) {
      return { error: failure };
    }

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    return {
      error: errorMessageFromUnknown(error, "Could not update category"),
    };
  }
}

export async function deleteCategoryAction(
  categoryId: string,
): Promise<ActionResult> {
  try {
    const session = await requireRole(["OWNER"]);
    const supabase = await createClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("organization_id", session.organization.id);

    const failure = categoryWriteFailure(error, "Could not delete category");
    if (failure) {
      return { error: failure };
    }

    revalidateCategoryPaths();
    return { success: true };
  } catch (error) {
    return {
      error: errorMessageFromUnknown(error, "Could not delete category"),
    };
  }
}
