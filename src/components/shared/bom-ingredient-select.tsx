"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface BomIngredientOption {
  id: string;
  name: string;
}

interface BomIngredientSelectProps {
  index: number;
  idPrefix: string;
  value: string;
  ingredients: BomIngredientOption[];
  disabledIds?: Set<string>;
  onValueChange: (ingredientId: string) => void;
}

export function BomIngredientSelect({
  index,
  idPrefix,
  value,
  ingredients,
  disabledIds,
  onValueChange,
}: Readonly<BomIngredientSelectProps>) {
  const fieldId = `${idPrefix}-ingredient-${index}`;

  return (
    <div className="space-y-2 sm:col-span-1">
      <Label htmlFor={fieldId}>Ingredient</Label>
      <Select
        value={value}
        onValueChange={(next) => onValueChange(next ?? "")}
        items={ingredients.map((ingredient) => ({
          value: ingredient.id,
          label: ingredient.name,
        }))}
      >
        <SelectTrigger id={fieldId} className="min-h-11 w-full">
          <SelectValue placeholder="Select ingredient" />
        </SelectTrigger>
        <SelectContent>
          {ingredients.map((ingredient) => (
            <SelectItem
              key={ingredient.id}
              value={ingredient.id}
              disabled={disabledIds?.has(ingredient.id)}
            >
              {ingredient.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
