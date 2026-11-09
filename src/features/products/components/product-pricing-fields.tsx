"use client";

import { centsToPesos } from "@/lib/money";

import { Input, Label } from "@/components/ui";

import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductPricingFieldsProps {
  isEdit: boolean;
  product?: Pick<
    ProductFormValues,
    "priceCents" | "costCents" | "quantity" | "reorderLevel"
  >;
}

export function ProductPricingFields({
  isEdit,
  product,
}: Readonly<ProductPricingFieldsProps>) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="price">Price (₱)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? centsToPesos(product.priceCents) : ""}
          placeholder="0.00"
          required
          className="min-h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cost">Cost (₱)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product ? centsToPesos(product.costCents) : ""}
          placeholder="0.00"
          className="min-h-11"
        />
      </div>
      {!isEdit ? (
        <div className="space-y-2">
          <Label htmlFor="quantity">Opening stock</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            defaultValue={product?.quantity ?? ""}
            placeholder="0"
            className="min-h-11"
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="reorderLevel">Low stock alert</Label>
        <Input
          id="reorderLevel"
          name="reorderLevel"
          type="number"
          min="0"
          defaultValue={product?.reorderLevel ?? ""}
          placeholder="5"
          className="min-h-11"
          aria-describedby="reorderLevelHelp"
        />
        <p id="reorderLevelHelp" className="text-xs text-muted-foreground">
          Mark as Low when on hand reaches this number.
        </p>
      </div>
    </>
  );
}
