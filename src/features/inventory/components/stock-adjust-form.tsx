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

import { adjustStockAction } from "@/features/inventory/api/inventory.actions";

interface StockAdjustFormProps {
  productId: string;
  onSuccess?: () => void;
}

const STOCK_ADJUST_ITEMS = [
  { value: "IN", label: "Add stock (delivery)" },
  { value: "OUT", label: "Remove stock" },
  { value: "ADJUST", label: "Correct to exact number" },
] as const;

export function StockAdjustForm({
  productId,
  onSuccess,
}: Readonly<StockAdjustFormProps>) {
  const [type, setType] = useState("IN");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("productId", productId);
    formData.set("type", type);

    startTransition(async () => {
      const result = await adjustStockAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      onSuccess?.();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="stockAdjustType">What happened</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value ?? "IN")}
          items={[...STOCK_ADJUST_ITEMS]}
        >
          <SelectTrigger id="stockAdjustType" className="min-h-11 w-full">
            <SelectValue placeholder="Choose what happened" />
          </SelectTrigger>
          <SelectContent>
            {STOCK_ADJUST_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">
          {type === "ADJUST" ? "New quantity" : "Quantity"}
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          required
          placeholder="1"
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Delivery, spoilage, staff meal..."
          required
          className="min-h-24"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <AdjustmentFormDialogFooter isPending={isPending} />
    </form>
  );
}
