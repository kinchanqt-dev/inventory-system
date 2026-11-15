"use client";

import { BomLinesToolbar } from "@/components/shared/bom-lines-toolbar";

import { RecipeCostSummary } from "@/features/products/components/recipe-cost-summary";
import { RecipeEditorLine } from "@/features/products/components/recipe-editor-line";

import type { FoodCostSettings } from "@/lib/food-cost";
import type { useRecipeLines } from "@/features/products/hooks/use-recipe-lines.hooks";
import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
} from "@/features/products/types/recipe.types";

type RecipeLinesApi = ReturnType<typeof useRecipeLines>;

interface RecipeBomSectionProps {
  title?: string;
  description?: string;
  linesState: RecipeLinesApi;
  ingredients: RecipeEditorIngredientOption[];
  subRecipes: RecipeEditorSubRecipeOption[];
  foodCostSettings: FoodCostSettings;
}

export function RecipeBomSection({
  title = "Recipe (BOM)",
  description = "Link ingredients or sub-recipes to calculate food cost for this menu item.",
  linesState,
  ingredients,
  subRecipes,
  foodCostSettings,
}: Readonly<RecipeBomSectionProps>) {
  return (
    <section className="space-y-4 rounded-xl border border-border/80 p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4">
        <BomLinesToolbar
          description="Use the portion you cook with in a matching unit (e.g. buy 1 kg chicken → recipe 180 g, not 1 pc of the pack)."
          onAddLine={linesState.addLine}
        />

        <div className="space-y-3">
          {linesState.lines.map((line, index) => (
            <RecipeEditorLine
              key={`${index}-${line.lineKind}-${line.ingredientId || line.subRecipeId || "new"}`}
              index={index}
              line={line}
              linesCount={linesState.lines.length}
              ingredients={ingredients}
              subRecipes={subRecipes}
              onKindChange={linesState.handleKindChange}
              onIngredientChange={linesState.handleIngredientChange}
              onSubRecipeChange={linesState.handleSubRecipeChange}
              onQtyChange={(lineIndex, qty) =>
                linesState.updateLine(lineIndex, { qty })
              }
              onUnitChange={(lineIndex, unit) =>
                linesState.updateLine(lineIndex, { unit })
              }
              onRemove={linesState.removeLine}
            />
          ))}
        </div>
      </div>

      <RecipeCostSummary
        costSummary={linesState.costSummary}
        foodCostSettings={foodCostSettings}
      />
    </section>
  );
}
