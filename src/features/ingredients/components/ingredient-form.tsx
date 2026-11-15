"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { pendingEditSubmitLabel } from "@/lib/form-submit-label";
import { navigateWithUnsavedGuard } from "@/lib/unsaved-changes.store";

import { useFormDirtyGuard } from "@/hooks";

import { Button } from "@/components/ui";

import { IngredientFormFields } from "@/features/ingredients/components/ingredient-form-fields";
import { runIngredientFormSubmit } from "@/features/ingredients/lib/ingredient-form-submit";

import type {
  IngredientCategoryOption,
  IngredientFormValues,
} from "@/features/ingredients/types/ingredient.types";

interface IngredientFormProps {
  categories: IngredientCategoryOption[];
  ingredient?: IngredientFormValues;
  onSuccess?: () => void;
}

function FormErrorMessage({ error }: Readonly<{ error: string | null }>) {
  if (!error) {
    return null;
  }
  return <p className="text-sm text-destructive">{error}</p>;
}

export function IngredientForm({
  categories,
  ingredient,
  onSuccess,
}: Readonly<IngredientFormProps>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(ingredient?.categoryId ?? "");
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);
  const isEdit = Boolean(ingredient?.id);

  const submitLabel = pendingEditSubmitLabel({
    isPending,
    isEdit,
    createLabel: "Add ingredient",
    editLabel: "Update ingredient",
  });

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("categoryId", categoryId);

    startTransition(async () => {
      await runIngredientFormSubmit({
        ingredientId: ingredient?.id,
        formData,
        isEdit,
        onSuccess,
        router,
        setError,
      });
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto max-w-3xl space-y-6"
      {...dirty.formDirtyProps}
    >
      <IngredientFormFields
        categories={categories}
        ingredient={ingredient}
        categoryId={categoryId}
        onCategoryChange={(value) => {
          dirty.markDirty();
          setCategoryId(value);
        }}
      />

      <FormErrorMessage error={error} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isPending}
          onClick={() =>
            navigateWithUnsavedGuard("/ingredients", (href) =>
              router.push(href),
            )
          }
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-h-11">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
