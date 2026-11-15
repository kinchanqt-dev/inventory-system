"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { pesosToCents } from "@/lib/money";
import { navigateWithUnsavedGuard } from "@/lib/unsaved-changes.store";

import { useDirtyWhenChanged, useFormDirtyGuard } from "@/hooks";

import { Button } from "@/components/ui";

import { ProductFormFields } from "@/features/products/components/product-form-fields";
import { RecipeBomSection } from "@/features/products/components/recipe-bom-section";
import { useRecipeLines } from "@/features/products/hooks/use-recipe-lines.hooks";
import { createProductWithRecipe } from "@/features/products/lib/create-product-with-recipe";
import {
  clampOpeningStockValue,
  openingStockError,
} from "@/features/products/lib/opening-stock-quantity";

import type { FoodCostSettings } from "@/lib/food-cost";
import type { CategoryOption } from "@/features/products/types/product.types";
import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeIngredientCostInput,
  RecipeSubRecipeCostInput,
} from "@/features/products/types/recipe.types";

interface ProductCreateFormProps {
  categories: CategoryOption[];
  ingredients: RecipeEditorIngredientOption[];
  subRecipes: RecipeEditorSubRecipeOption[];
  ingredientCosts: RecipeIngredientCostInput[];
  subRecipeCosts: RecipeSubRecipeCostInput[];
  foodCostSettings: FoodCostSettings;
}

function safeMenuPriceCents(priceValue: string) {
  try {
    return pesosToCents(priceValue || 0);
  } catch {
    return 0;
  }
}

function CreateFormActions({
  isPending,
  onCancel,
}: Readonly<{ isPending: boolean; onCancel: () => void }>) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        disabled={isPending}
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isPending} className="min-h-11">
        {isPending ? "Adding product..." : "Add product"}
      </Button>
    </div>
  );
}

export function ProductCreateForm({
  categories,
  ingredients,
  subRecipes,
  ingredientCosts,
  subRecipeCosts,
  foodCostSettings,
}: Readonly<ProductCreateFormProps>) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [quantityValue, setQuantityValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const dirty = useFormDirtyGuard(isPending);

  const linesState = useRecipeLines({
    ingredients,
    subRecipes,
    ingredientCosts,
    subRecipeCosts,
    portionsPerBatch: 1,
    menuPriceCents: safeMenuPriceCents(priceValue),
    laborCents: 0,
    packagingCents: 0,
    foodCostSettings,
  });

  useDirtyWhenChanged(linesState.lines, dirty.markDirty);

  const quantityError = openingStockError(
    quantityValue,
    linesState.maxMakeable,
  );

  useEffect(() => {
    setQuantityValue((current) =>
      clampOpeningStockValue(current, linesState.maxMakeable),
    );
  }, [linesState.maxMakeable]);

  function handleQuantityChange(value: string) {
    dirty.markDirty();
    setQuantityValue(clampOpeningStockValue(value, linesState.maxMakeable));
  }

  function handleSubmit(formData: FormData) {
    setError(null);

    if (quantityError) {
      setError(quantityError);
      return;
    }

    formData.set("categoryId", categoryId);
    formData.set("isActive", "true");
    formData.set("cost", "0");
    formData.set("quantity", quantityValue.trim() === "" ? "0" : quantityValue);

    startTransition(async () => {
      await createProductWithRecipe({
        formData,
        lines: linesState.lines,
        setError,
        router,
      });
    });
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto max-w-3xl space-y-6"
      {...dirty.formDirtyProps}
    >
      <ProductFormFields
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={(value) => {
          dirty.markDirty();
          setCategoryId(value);
        }}
        isEdit={false}
        computedCostCents={
          linesState.costSummary?.foodCostPerPortionCents ?? null
        }
        priceValue={priceValue}
        onPriceChange={(value) => {
          dirty.markDirty();
          setPriceValue(value);
        }}
        quantityValue={quantityValue}
        onQuantityChange={handleQuantityChange}
        maxMakeable={linesState.maxMakeable}
        quantityError={quantityError}
        beforePricing={
          <RecipeBomSection
            description="Add ingredients or sub-recipes so food cost is calculated before you set the selling price."
            linesState={linesState}
            ingredients={ingredients}
            subRecipes={subRecipes}
            foodCostSettings={foodCostSettings}
          />
        }
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <CreateFormActions
        isPending={isPending}
        onCancel={() =>
          navigateWithUnsavedGuard("/products", (href) => router.push(href))
        }
      />
    </form>
  );
}
