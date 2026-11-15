"use client";

import { useState } from "react";

import { UnitSelect } from "@/components/shared/unit-select";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";

import { resolveIngredientFormDefaults } from "@/features/ingredients/lib/resolve-ingredient-form-defaults";

import type {
  IngredientCategoryOption,
  IngredientFormValues,
} from "@/features/ingredients/types/ingredient.types";

interface IngredientFormFieldsProps {
  categories: IngredientCategoryOption[];
  ingredient?: IngredientFormValues;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
}

export function IngredientFormFields({
  categories,
  ingredient,
  categoryId,
  onCategoryChange,
}: Readonly<IngredientFormFieldsProps>) {
  const defaults = resolveIngredientFormDefaults(ingredient);
  const [packUnit, setPackUnit] = useState(defaults.packUnit);

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
          placeholder="Chicken breast"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          value={categoryId}
          onValueChange={(value) => onCategoryChange(value ?? "")}
          items={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        >
          <SelectTrigger id="categoryId" className="min-h-11 w-full">
            <SelectValue placeholder="Optional category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          name="supplier"
          defaultValue={defaults.supplier}
          className="min-h-11"
          placeholder="Optional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="packPricePesos">Pack price (₱)</Label>
        <Input
          id="packPricePesos"
          name="packPricePesos"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={defaults.packPrice}
          placeholder="0"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="packSize">Pack size</Label>
        <Input
          id="packSize"
          name="packSize"
          type="number"
          min="0.000001"
          step="any"
          required
          defaultValue={ingredient ? defaults.packSize : ""}
          placeholder="0"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="packUnit">Pack unit</Label>
        <UnitSelect
          id="packUnit"
          name="packUnit"
          value={packUnit}
          onValueChange={setPackUnit}
        />
        <p className="text-xs text-muted-foreground">
          How you buy this item (e.g. 1 kg bag, 1 L bottle, 12 pc tray). Stock
          and recipes use this unit family.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yieldPercent">Yield (%)</Label>
        <Input
          id="yieldPercent"
          name="yieldPercent"
          type="number"
          min="1"
          max="100"
          step="0.1"
          required
          defaultValue={defaults.yieldPercent}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="minStock">Minimum stock alert</Label>
        <Input
          id="minStock"
          name="minStock"
          type="number"
          min="0"
          step="any"
          defaultValue={defaults.minStock === 0 ? "" : defaults.minStock}
          placeholder="0"
          className="min-h-11"
        />
      </div>

      {defaults.showInitialStock ? (
        <div className="space-y-2">
          <Label htmlFor="initialStock">Starting stock</Label>
          <Input
            id="initialStock"
            name="initialStock"
            type="number"
            min="0"
            step="any"
            defaultValue=""
            placeholder="0"
            className="min-h-11"
          />
        </div>
      ) : null}

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={defaults.notes}
          placeholder="Storage, brand, or ordering notes"
          className="min-h-24"
        />
      </div>
    </div>
  );
}
