"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeLineFormValues,
} from "@/features/products/types/recipe.types";

interface RecipeEditorLineItemSelectProps {
  index: number;
  line: RecipeLineFormValues;
  ingredients: RecipeEditorIngredientOption[];
  subRecipes: RecipeEditorSubRecipeOption[];
  onIngredientChange: (index: number, ingredientId: string) => void;
  onSubRecipeChange: (index: number, subRecipeId: string) => void;
}

function IngredientSelect({
  index,
  value,
  ingredients,
  onChange,
}: Readonly<{
  index: number;
  value: string;
  ingredients: RecipeEditorIngredientOption[];
  onChange: (ingredientId: string) => void;
}>) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? "")}
      items={ingredients.map((ingredient) => ({
        value: ingredient.id,
        label: ingredient.name,
      }))}
    >
      <SelectTrigger id={`line-item-${index}`} className="min-h-11 w-full">
        <SelectValue placeholder="Select ingredient" />
      </SelectTrigger>
      <SelectContent>
        {ingredients.map((ingredient) => (
          <SelectItem key={ingredient.id} value={ingredient.id}>
            {ingredient.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SubRecipeSelect({
  index,
  value,
  subRecipes,
  onChange,
}: Readonly<{
  index: number;
  value: string;
  subRecipes: RecipeEditorSubRecipeOption[];
  onChange: (subRecipeId: string) => void;
}>) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? "")}
      items={subRecipes.map((subRecipe) => ({
        value: subRecipe.id,
        label: subRecipe.name,
      }))}
    >
      <SelectTrigger id={`line-item-${index}`} className="min-h-11 w-full">
        <SelectValue placeholder="Select sub-recipe" />
      </SelectTrigger>
      <SelectContent>
        {subRecipes.map((subRecipe) => (
          <SelectItem key={subRecipe.id} value={subRecipe.id}>
            {subRecipe.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function RecipeEditorLineItemSelect({
  index,
  line,
  ingredients,
  subRecipes,
  onIngredientChange,
  onSubRecipeChange,
}: Readonly<RecipeEditorLineItemSelectProps>) {
  const itemLabel =
    line.lineKind === "ingredient" ? "Ingredient" : "Sub-recipe";

  return (
    <div className="space-y-2">
      <Label htmlFor={`line-item-${index}`}>{itemLabel}</Label>
      {line.lineKind === "ingredient" ? (
        <IngredientSelect
          index={index}
          value={line.ingredientId}
          ingredients={ingredients}
          onChange={(ingredientId) => onIngredientChange(index, ingredientId)}
        />
      ) : (
        <SubRecipeSelect
          index={index}
          value={line.subRecipeId}
          subRecipes={subRecipes}
          onChange={(subRecipeId) => onSubRecipeChange(index, subRecipeId)}
        />
      )}
    </div>
  );
}
