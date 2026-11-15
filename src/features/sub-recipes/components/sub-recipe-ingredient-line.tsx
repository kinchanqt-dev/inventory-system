"use client";

import { bomQtyFieldBindings } from "@/lib/bom-qty-field-bindings";
import { compatibleCatalogUnits } from "@/lib/food-cost/units";

import { BomIngredientSelect } from "@/components/shared/bom-ingredient-select";
import { BomLineQtyFields } from "@/components/shared/bom-line-qty-fields";

import type {
  SubRecipeIngredientOption,
  SubRecipeLineFormValues,
} from "@/features/sub-recipes/types/sub-recipe.types";

interface SubRecipeIngredientLineProps {
  index: number;
  line: SubRecipeLineFormValues;
  lines: SubRecipeLineFormValues[];
  ingredients: SubRecipeIngredientOption[];
  onIngredientChange: (index: number, ingredientId: string) => void;
  onQtyChange: (index: number, qty: number) => void;
  onUnitChange: (index: number, unit: string) => void;
  onRemove: (index: number) => void;
}

export function SubRecipeIngredientLine({
  index,
  line,
  lines,
  ingredients,
  onIngredientChange,
  onQtyChange,
  onUnitChange,
  onRemove,
}: Readonly<SubRecipeIngredientLineProps>) {
  const usedElsewhere = new Set(
    lines
      .filter((_, lineIndex) => lineIndex !== index)
      .map((entry) => entry.ingredientId)
      .filter(Boolean),
  );
  const selected = ingredients.find((item) => item.id === line.ingredientId);
  const unitOptions = compatibleCatalogUnits(
    selected?.packUnit || line.unit || "pc",
  );

  return (
    <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-bom-sub">
      <BomIngredientSelect
        index={index}
        idPrefix="sub-recipe"
        value={line.ingredientId}
        ingredients={ingredients}
        disabledIds={usedElsewhere}
        onValueChange={(ingredientId) =>
          onIngredientChange(index, ingredientId)
        }
      />

      <BomLineQtyFields
        {...bomQtyFieldBindings({
          index,
          idPrefix: "sub-recipe",
          qty: line.qty,
          unit: line.unit,
          unitOptions,
          canRemove: lines.length > 1,
          removeLabel: `Remove line ${index + 1}`,
          onQtyChange,
          onUnitChange,
          onRemove,
        })}
      />
    </div>
  );
}
