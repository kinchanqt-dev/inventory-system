"use client";

import { useState } from "react";

import { UnitSelect } from "@/components/shared/unit-select";
import { Input, Label, Textarea } from "@/components/ui";

import { resolveSubRecipeFormDefaults } from "@/features/sub-recipes/lib/resolve-sub-recipe-form-defaults";

import type { SubRecipeFormValues } from "@/features/sub-recipes/types/sub-recipe.types";

interface SubRecipeMetaFieldsProps {
  subRecipe?: SubRecipeFormValues;
}

export function SubRecipeMetaFields({
  subRecipe,
}: Readonly<SubRecipeMetaFieldsProps>) {
  const defaults = resolveSubRecipeFormDefaults(subRecipe);
  const [batchUnit, setBatchUnit] = useState(defaults.batchUnit);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={defaults.name}
          className="min-h-11"
          placeholder="House marinara"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="batchQty">Batch quantity</Label>
        <Input
          id="batchQty"
          name="batchQty"
          type="number"
          min="0.000001"
          step="any"
          required
          defaultValue={subRecipe ? defaults.batchQty : ""}
          placeholder="0"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="batchUnit">Batch unit</Label>
        <UnitSelect
          id="batchUnit"
          name="batchUnit"
          value={batchUnit}
          onValueChange={setBatchUnit}
        />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaults.notes}
          placeholder="Prep steps, hold time, or storage"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
