"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useDirtyWhenChanged, useFormDirtyGuard } from "@/hooks";

import { replaceProductRecipeAction } from "@/features/products/api/recipe.actions";
import {
  useRecipeLines,
  type UseRecipeLinesInput,
} from "@/features/products/hooks/use-recipe-lines.hooks";
import { linesToSubmitPayload } from "@/features/products/lib/recipe-line-payload";

interface UseRecipeEditorInput extends UseRecipeLinesInput {
  productId: string;
}

export function useRecipeEditor(input: UseRecipeEditorInput) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);
  const linesState = useRecipeLines(input);

  useDirtyWhenChanged(linesState.lines, dirty.markDirty);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set(
      "linesJson",
      JSON.stringify(linesToSubmitPayload(linesState.lines)),
    );

    startTransition(async () => {
      const result = await replaceProductRecipeAction(input.productId, formData);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      dirty.markClean();
      toast.success("Recipe saved");
      router.refresh();
    });
  }

  return {
    ...linesState,
    error,
    isPending,
    formDirtyProps: dirty.formDirtyProps,
    handleSubmit,
  };
}
