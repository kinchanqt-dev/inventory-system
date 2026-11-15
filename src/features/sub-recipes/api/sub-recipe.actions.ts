"use server";

import { revalidatePath } from "next/cache";

import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import { parseLinesJsonFromFormData } from "@/lib/parse-lines-json-from-form";
import { requireRole } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { insertSubRecipeRecord } from "@/features/sub-recipes/lib/create-sub-recipe-core";
import {
  assertSubRecipeExists,
  updateSubRecipeRecord,
} from "@/features/sub-recipes/lib/update-sub-recipe-core";
import { assertSubRecipeLineUnitsCompatible } from "@/features/sub-recipes/lib/validate-sub-recipe-line-units";
import { subRecipeSchema } from "@/features/sub-recipes/schemas/sub-recipe.schema";

function revalidateSubRecipePaths() {
  revalidatePath("/sub-recipes");
}

function emptyToUndefined(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readSubRecipeFormData(formData: FormData) {
  const parsedLines = parseLinesJsonFromFormData(
    formData,
    "Could not read ingredient lines",
  );
  if ("parseError" in parsedLines) {
    return parsedLines;
  }

  return {
    name: formData.get("name"),
    batchQty: formData.get("batchQty"),
    batchUnit: formData.get("batchUnit") || "portion",
    notes: emptyToUndefined(formData.get("notes")),
    lines: parsedLines.lines,
  };
}

function parseSubRecipeInput(formData: FormData) {
  const raw = readSubRecipeFormData(formData);
  if ("parseError" in raw) {
    return { error: raw.parseError };
  }

  const parsed = subRecipeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid sub-recipe"),
    };
  }

  return { data: parsed.data };
}

async function beginOwnerSubRecipeWrite(formData: FormData) {
  const session = await requireRole(["OWNER"]);
  const parsed = parseSubRecipeInput(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = await createClient();
  const unitError = await assertSubRecipeLineUnitsCompatible(
    supabase,
    session.organization.id,
    parsed.data.lines,
  );
  if (unitError) {
    return { error: unitError };
  }

  return {
    orgId: session.organization.id,
    data: parsed.data,
    supabase,
  };
}

async function replaceSubRecipeLines(
  supabase: Awaited<ReturnType<typeof createClient>>,
  orgId: string,
  subRecipeId: string,
  lines: Array<{ ingredientId: string; qty: number; unit: string }>,
) {
  const { error: deleteError } = await supabase
    .from("sub_recipe_lines")
    .delete()
    .eq("sub_recipe_id", subRecipeId)
    .eq("organization_id", orgId);

  if (deleteError) {
    return { error: "Could not update sub-recipe lines." };
  }

  if (lines.length === 0) {
    return { success: true as const };
  }

  const { error: insertError } = await supabase.from("sub_recipe_lines").insert(
    lines.map((line, index) => ({
      organization_id: orgId,
      sub_recipe_id: subRecipeId,
      ingredient_id: line.ingredientId,
      qty: line.qty,
      unit: line.unit,
      sort_order: index,
    })),
  );

  if (insertError) {
    return { error: "Could not save sub-recipe lines." };
  }

  return { success: true as const };
}

async function saveNewSubRecipe(
  started: {
    orgId: string;
    data: {
      name: string;
      batchQty: number;
      batchUnit: string;
      notes?: string;
      lines: Array<{ ingredientId: string; qty: number; unit: string }>;
    };
    supabase: Awaited<ReturnType<typeof createClient>>;
  },
) {
  const inserted = await insertSubRecipeRecord(
    started.supabase,
    started.orgId,
    started.data,
  );
  if ("error" in inserted) {
    return inserted;
  }

  const linesResult = await replaceSubRecipeLines(
    started.supabase,
    started.orgId,
    inserted.subRecipe.id,
    started.data.lines,
  );

  if ("error" in linesResult) {
    await started.supabase
      .from("sub_recipes")
      .delete()
      .eq("id", inserted.subRecipe.id);
    return { error: linesResult.error };
  }

  return { success: true as const };
}

export async function createSubRecipeAction(formData: FormData) {
  const started = await beginOwnerSubRecipeWrite(formData);
  if ("error" in started) {
    return { error: started.error };
  }

  const result = await saveNewSubRecipe(started);
  if ("error" in result) {
    return { error: result.error };
  }

  revalidateSubRecipePaths();
  return { success: true };
}

async function saveUpdatedSubRecipe(
  subRecipeId: string,
  started: {
    orgId: string;
    data: {
      name: string;
      batchQty: number;
      batchUnit: string;
      notes?: string;
      lines: Array<{ ingredientId: string; qty: number; unit: string }>;
    };
    supabase: Awaited<ReturnType<typeof createClient>>;
  },
) {
  const existsResult = await assertSubRecipeExists(
    started.supabase,
    started.orgId,
    subRecipeId,
  );
  if ("error" in existsResult) {
    return existsResult;
  }

  const updateResult = await updateSubRecipeRecord(
    started.supabase,
    started.orgId,
    subRecipeId,
    started.data,
  );
  if ("error" in updateResult) {
    return updateResult;
  }

  return replaceSubRecipeLines(
    started.supabase,
    started.orgId,
    subRecipeId,
    started.data.lines,
  );
}

export async function updateSubRecipeAction(
  subRecipeId: string,
  formData: FormData,
) {
  const started = await beginOwnerSubRecipeWrite(formData);
  if ("error" in started) {
    return { error: started.error };
  }

  const result = await saveUpdatedSubRecipe(subRecipeId, started);
  if ("error" in result) {
    return { error: result.error };
  }

  revalidateSubRecipePaths();
  return { success: true };
}

export async function deleteSubRecipeAction(subRecipeId: string) {
  const session = await requireRole(["OWNER"]);
  const orgId = session.organization.id;
  const supabase = await createClient();

  const { error } = await supabase
    .from("sub_recipes")
    .delete()
    .eq("id", subRecipeId)
    .eq("organization_id", orgId);

  if (error) {
    return {
      error:
        "Could not delete sub-recipe. It may be used in a menu recipe.",
    };
  }

  revalidateSubRecipePaths();
  return { success: true };
}
