"use client";

import { useMemo, useState } from "react";

import {
  computeRecipeCost,
  type FoodCostSettings,
} from "@/lib/food-cost";
import { bindRemoveBomLine } from "@/lib/bom-line-list";
import { pickDefined } from "@/lib/require-query-result";

import {
  buildIngredientCostMap,
  buildSubRecipeCostMap,
} from "@/features/products/lib/build-recipe-cost-maps";
import {
  maxMakeablePortions,
  type IngredientStockInput,
} from "@/features/products/lib/max-makeable-portions";
import { linesToCostInputs } from "@/features/products/lib/recipe-line-payload";
import {
  createEmptyRecipeLine,
  toRecipeLineFormValues,
} from "@/features/products/lib/to-recipe-line-form-values";

import type {
  RecipeEditorIngredientOption,
  RecipeEditorSubRecipeOption,
  RecipeIngredientCostInput,
  RecipeLineFormValues,
  RecipeLineKind,
  RecipeSubRecipeCostInput,
  UiRecipeLine,
} from "@/features/products/types/recipe.types";

export interface UseRecipeLinesInput {
  initialLines?: UiRecipeLine[];
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

export function useRecipeLines(input: UseRecipeLinesInput) {
  const [lines, setLines] = useState<RecipeLineFormValues[]>(
    toRecipeLineFormValues(input.initialLines ?? []),
  );

  const ingredientById = useMemo(
    () => new Map(input.ingredients.map((item) => [item.id, item])),
    [input.ingredients],
  );

  const subRecipeById = useMemo(
    () => new Map(input.subRecipes.map((item) => [item.id, item])),
    [input.subRecipes],
  );

  const ingredientsById = useMemo(
    () => buildIngredientCostMap(input.ingredientCosts),
    [input.ingredientCosts],
  );

  const subRecipesById = useMemo(
    () => buildSubRecipeCostMap(input.subRecipeCosts),
    [input.subRecipeCosts],
  );

  const stockById = useMemo(() => {
    const map = new Map<string, IngredientStockInput>();
    for (const item of input.ingredients) {
      map.set(item.id, {
        id: item.id,
        stockQuantity: item.stockQuantity,
        stockUnit: item.stockUnit,
      });
    }
    return map;
  }, [input.ingredients]);

  const costSummary = useMemo(() => {
    const recipeLines = linesToCostInputs(lines);
    if (recipeLines.length === 0) {
      return null;
    }

    try {
      return computeRecipeCost(
        {
          portionsPerBatch: input.portionsPerBatch,
          menuPriceCents: input.menuPriceCents,
          laborCents: input.laborCents,
          packagingCents: input.packagingCents,
          lines: recipeLines,
        },
        ingredientsById,
        subRecipesById,
        input.foodCostSettings,
      );
    } catch {
      return null;
    }
  }, [
    ingredientsById,
    input.foodCostSettings,
    input.laborCents,
    input.menuPriceCents,
    input.packagingCents,
    input.portionsPerBatch,
    lines,
    subRecipesById,
  ]);

  const maxMakeable = useMemo(
    () =>
      maxMakeablePortions(
        linesToCostInputs(lines),
        input.portionsPerBatch,
        ingredientsById,
        subRecipesById,
        stockById,
      ),
    [ingredientsById, input.portionsPerBatch, lines, stockById, subRecipesById],
  );

  function updateLine(index: number, patch: Partial<RecipeLineFormValues>) {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, ...patch } : line,
      ),
    );
  }

  function handleKindChange(index: number, lineKind: RecipeLineKind) {
    updateLine(index, {
      lineKind,
      ingredientId: "",
      subRecipeId: "",
      unit: lineKind === "ingredient" ? "pc" : "portion",
    });
  }

  function handleIngredientChange(index: number, ingredientId: string) {
    const ingredient = ingredientById.get(ingredientId);
    updateLine(index, {
      lineKind: "ingredient",
      ingredientId,
      subRecipeId: "",
      unit: pickDefined(ingredient?.packUnit, lines[index]?.unit, "pc"),
    });
  }

  function handleSubRecipeChange(index: number, subRecipeId: string) {
    const subRecipe = subRecipeById.get(subRecipeId);
    updateLine(index, {
      lineKind: "sub_recipe",
      subRecipeId,
      ingredientId: "",
      unit: pickDefined(subRecipe?.batchUnit, lines[index]?.unit, "portion"),
    });
  }

  function addLine() {
    setLines((current) => [...current, createEmptyRecipeLine()]);
  }

  return {
    lines,
    costSummary,
    maxMakeable,
    addLine,
    removeLine: bindRemoveBomLine(setLines),
    updateLine,
    handleKindChange,
    handleIngredientChange,
    handleSubRecipeChange,
  };
}
