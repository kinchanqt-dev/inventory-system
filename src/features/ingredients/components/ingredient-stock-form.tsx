"use client";

import { useState, useTransition } from "react";

import { AdjustmentFormDialogFooter } from "@/components/shared/adjustment-form-dialog-footer";

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

import { adjustIngredientStockAction } from "@/features/ingredients/api/ingredient.actions";

interface IngredientStockFormProps {
  ingredientId: string;
  onSuccess?: () => void;
}

const ADJUST_ITEMS = [
  { value: "IN", label: "Add stock (delivery)" },
  { value: "OUT", label: "Remove stock" },
  { value: "ADJUST", label: "Correct to exact quantity" },
] as const;

export function IngredientStockForm({
  ingredientId,
  onSuccess,
}: Readonly<IngredientStockFormProps>) {
  const [type, setType] = useState("IN");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("ingredientId", ingredientId);
    formData.set("type", type);

    startTransition(async () => {
      const result = await adjustIngredientStockAction(formData);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="ingredientAdjustType">What happened</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value ?? "IN")}
          items={[...ADJUST_ITEMS]}
        >
          <SelectTrigger id="ingredientAdjustType" className="min-h-11 w-full">
            <SelectValue placeholder="Choose what happened" />
          </SelectTrigger>
          <SelectContent>
            {ADJUST_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredientQuantity">
          {type === "ADJUST" ? "New quantity" : "Quantity"}
        </Label>
        <Input
          id="ingredientQuantity"
          name="quantity"
          type="number"
          min="0.000001"
          step="any"
          required
          placeholder="1"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredientReason">Reason (optional)</Label>
        <Textarea
          id="ingredientReason"
          name="reason"
          placeholder="Delivery, spoilage, prep usage..."
          className="min-h-24"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <AdjustmentFormDialogFooter isPending={isPending} />
    </form>
  );
}