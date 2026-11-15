"use client";

import { useRouter } from "next/navigation";

import { navigateWithUnsavedGuard } from "@/lib/unsaved-changes.store";

import { BomLinesToolbar } from "@/components/shared/bom-lines-toolbar";

import { SubRecipeFormActions } from "@/features/sub-recipes/components/sub-recipe-form-actions";
import { SubRecipeIngredientLine } from "@/features/sub-recipes/components/sub-recipe-ingredient-line";
import { SubRecipeMetaFields } from "@/features/sub-recipes/components/sub-recipe-meta-fields";
import { useSubRecipeForm } from "@/features/sub-recipes/hooks/use-sub-recipe-form.hooks";

import type {
  SubRecipeFormValues,
  SubRecipeIngredientOption,
} from "@/features/sub-recipes/types/sub-recipe.types";

interface SubRecipeFormProps {
  ingredients: SubRecipeIngredientOption[];
  subRecipe?: SubRecipeFormValues;
  onSuccess?: () => void;
}

export function SubRecipeForm({
  ingredients,
  subRecipe,
  onSuccess,
}: Readonly<SubRecipeFormProps>) {
  const router = useRouter();
  const form = useSubRecipeForm({ ingredients, subRecipe, onSuccess });

  return (
    <form
      action={form.handleSubmit}
      className="mx-auto max-w-3xl space-y-8"
      {...form.formDirtyProps}
    >
      <SubRecipeMetaFields subRecipe={subRecipe} />

      <div className="space-y-4">
        <BomLinesToolbar
          description={
            <>
              <h2 className="text-base font-medium text-foreground">
                Ingredient lines
              </h2>
              <p>
                Costs use each ingredient&apos;s pack price, size, and yield.
              </p>
            </>
          }
          onAddLine={form.addLine}
        />

        <div className="space-y-3">
          {form.lines.map((line, index) => (
            <SubRecipeIngredientLine
              key={`${index}-${line.ingredientId || "new"}`}
              index={index}
              line={line}
              lines={form.lines}
              ingredients={ingredients}
              onIngredientChange={form.handleIngredientChange}
              onQtyChange={(lineIndex, qty) =>
                form.updateLine(lineIndex, { qty })
              }
              onUnitChange={(lineIndex, unit) =>
                form.updateLine(lineIndex, { unit })
              }
              onRemove={form.removeLine}
            />
          ))}
        </div>
      </div>

      {form.error ? (
        <p className="text-sm text-destructive">{form.error}</p>
      ) : null}

      <SubRecipeFormActions
        isEdit={form.isEdit}
        isPending={form.isPending}
        isDeleting={form.isDeleting}
        submitLabel={form.submitLabel}
        deleteName={subRecipe?.name}
        onCancel={() =>
          navigateWithUnsavedGuard("/sub-recipes", (href) => router.push(href))
        }
        onDelete={form.handleDelete}
      />
    </form>
  );
}
