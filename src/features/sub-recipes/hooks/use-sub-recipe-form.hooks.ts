"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { bindRemoveBomLine } from "@/lib/bom-line-list";
import { pendingEditSubmitLabel } from "@/lib/form-submit-label";
import { pickDefined } from "@/lib/require-query-result";

import { useDirtyWhenChanged, useFormDirtyGuard } from "@/hooks";

import { deleteSubRecipeAction } from "@/features/sub-recipes/api/sub-recipe.actions";
import { runSubRecipeFormSubmit } from "@/features/sub-recipes/lib/sub-recipe-form-submit";

import type {
  SubRecipeFormValues,
  SubRecipeIngredientOption,
  SubRecipeLineFormValues,
} from "@/features/sub-recipes/types/sub-recipe.types";

function createEmptyLine(): SubRecipeLineFormValues {
  return {
    ingredientId: "",
    qty: 0,
    unit: "pc",
  };
}

interface UseSubRecipeFormInput {
  ingredients: SubRecipeIngredientOption[];
  subRecipe?: SubRecipeFormValues;
  onSuccess?: () => void;
}

export function useSubRecipeForm({
  ingredients,
  subRecipe,
  onSuccess,
}: UseSubRecipeFormInput) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<SubRecipeLineFormValues[]>(
    subRecipe?.lines.length
      ? subRecipe.lines.map((line) => ({ ...line }))
      : [createEmptyLine()],
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending || isDeleting);
  const isEdit = Boolean(subRecipe?.id);

  useDirtyWhenChanged(lines, dirty.markDirty);

  const ingredientById = useMemo(
    () => new Map(ingredients.map((item) => [item.id, item])),
    [ingredients],
  );

  const submitLabel = pendingEditSubmitLabel({
    isPending,
    isEdit,
    createLabel: "Create sub-recipe",
    editLabel: "Update sub-recipe",
  });

  function updateLine(
    index: number,
    patch: Partial<SubRecipeLineFormValues>,
  ) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    );
  }

  function handleIngredientChange(index: number, ingredientId: string) {
    const ingredient = ingredientById.get(ingredientId);
    updateLine(index, {
      ingredientId,
      unit: pickDefined(ingredient?.packUnit, lines[index]?.unit, "pc"),
    });
  }

  function addLine() {
    setLines((current) => [...current, createEmptyLine()]);
  }

  const removeLine = bindRemoveBomLine(setLines);

  function handleSubmit(formData: FormData) {
    setError(null);

    const payload = lines
      .filter((line) => line.ingredientId.trim().length > 0)
      .map((line) => ({
        ingredientId: line.ingredientId,
        qty: Number(line.qty),
        unit: line.unit.trim(),
      }));

    formData.set("linesJson", JSON.stringify(payload));

    startTransition(async () => {
      await runSubRecipeFormSubmit({
        subRecipeId: subRecipe?.id,
        formData,
        isEdit,
        onSuccess,
        router,
        setError,
      });
    });
  }

  function handleDelete() {
    if (!subRecipe?.id) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteSubRecipeAction(subRecipe.id!);
      if (result?.error) {
        toast.error(result.error);
        setError(result.error);
        return;
      }

      toast.success("Sub-recipe deleted");
      router.push("/sub-recipes");
      router.refresh();
    });
  }

  return {
    error,
    lines,
    isPending,
    isDeleting,
    isEdit,
    submitLabel,
    formDirtyProps: dirty.formDirtyProps,
    addLine,
    removeLine,
    updateLine,
    handleIngredientChange,
    handleSubmit,
    handleDelete,
  };
}
