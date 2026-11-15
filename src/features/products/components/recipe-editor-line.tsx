"use client";

import { BomLineQtyFields } from "@/components/shared/bom-line-qty-fields";
import { bomQtyFieldBindings } from "@/lib/bom-qty-field-bindings";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import { RecipeEditorLineItemSelect } from "@/features/products/components/recipe-editor-line-item-select";
import { recipeLineUnitOptions } from "@/features/products/lib/recipe-line-unit-options";

import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeLineFormValues,
  RecipeLineKind,
} from "@/features/products/types/recipe.types";

interface RecipeEditorLineProps {
  index: number;
  line: RecipeLineFormValues;
  linesCount: number;
  ingredients: RecipeEditorIngredientOption[];
  subRecipes: RecipeEditorSubRecipeOption[];
  onKindChange: (index: number, lineKind: RecipeLineKind) => void;
  onIngredientChange: (index: number, ingredientId: string) => void;
  onSubRecipeChange: (index: number, subRecipeId: string) => void;
  onQtyChange: (index: number, qty: number) => void;
  onUnitChange: (index: number, unit: string) => void;
  onRemove: (index: number) => void;
}

export function RecipeEditorLine({
  index,
  line,
  linesCount,
  ingredients,
  subRecipes,
  onKindChange,
  onIngredientChange,
  onSubRecipeChange,
  onQtyChange,
  onUnitChange,
  onRemove,
}: Readonly<RecipeEditorLineProps>) {
  const unitOptions = recipeLineUnitOptions(line, ingredients, subRecipes);

  return (
    <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-bom-recipe">
      <div className="space-y-2">
        <Label htmlFor={`line-kind-${index}`}>Type</Label>
        <Select
          value={line.lineKind}
          onValueChange={(value) =>
            onKindChange(index, value as RecipeLineKind)
          }
          items={[
            { value: "ingredient", label: "Ingredient" },
            { value: "sub_recipe", label: "Sub-recipe" },
          ]}
        >
          <SelectTrigger id={`line-kind-${index}`} className="min-h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingredient">Ingredient</SelectItem>
            <SelectItem value="sub_recipe">Sub-recipe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <RecipeEditorLineItemSelect
        index={index}
        line={line}
        ingredients={ingredients}
        subRecipes={subRecipes}
        onIngredientChange={onIngredientChange}
        onSubRecipeChange={onSubRecipeChange}
      />

      <BomLineQtyFields
        {...bomQtyFieldBindings({
          index,
          idPrefix: "recipe",
          qty: line.qty,
          unit: line.unit,
          unitOptions,
          canRemove: linesCount > 1,
          removeLabel: `Remove recipe line ${index + 1}`,
          onQtyChange,
          onUnitChange,
          onRemove,
        })}
      />
    </div>
  );
}
