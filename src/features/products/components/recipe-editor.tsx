"use client";

import type { FoodCostSettings } from "@/lib/food-cost";

import { Button } from "@/components/ui";

import { RecipeBomSection } from "@/features/products/components/recipe-bom-section";
import { useRecipeEditor } from "@/features/products/hooks/use-recipe-editor.hooks";

import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeIngredientCostInput,
  RecipeSubRecipeCostInput,
  UiRecipeLine,
} from "@/features/products/types/recipe.types";

interface RecipeEditorProps {
  productId: string;
  initialLines: UiRecipeLine[];
  ingredients: RecipeEditorIngredientOption[];
  subRecipes: RecipeEditorSubRecipeOption[];
  ingredientCosts: RecipeIngredientCostInput[];
  subRecipeCosts: RecipeSubRecipeCostInput[];
  portionsPerBatch: number;
  menuPriceCents: number;
  laborCents: number;
  packagingCents: number;
  foodCostSettings: FoodCostSettings;
}

export function RecipeEditor(props: Readonly<RecipeEditorProps>) {
  const editor = useRecipeEditor(props);

  return (
    <form
      action={editor.handleSubmit}
      className="mx-auto mb-12 max-w-3xl space-y-8"
      {...editor.formDirtyProps}
    >
      <RecipeBomSection
        description="Link ingredients or sub-recipes to calculate food cost for this menu item. Saving updates the product's cost field when costing data is available."
        linesState={editor}
        ingredients={props.ingredients}
        subRecipes={props.subRecipes}
        foodCostSettings={props.foodCostSettings}
      />

      {editor.error ? (
        <p className="text-sm text-destructive">{editor.error}</p>
      ) : null}

      <div>
        <Button
          type="submit"
          disabled={editor.isPending}
          className="min-h-11 w-full sm:w-auto"
        >
          {editor.isPending ? "Saving recipe..." : "Save recipe"}
        </Button>
      </div>
    </form>
  );
}
