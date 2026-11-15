import type { ChangeEvent } from "react";

import { centsToPesos, formatPesos } from "@/lib/money";

import { Input, Label } from "@/components/ui";

import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductPricingAmountFieldsProps {
  isEdit: boolean;
  product?: Pick<ProductFormValues, "priceCents" | "costCents">;
  computedCostCents?: number | null;
  priceValue?: string;
  onPriceChange?: (value: string) => void;
}

function priceDefaultValue(product?: Pick<ProductFormValues, "priceCents">) {
  if (product?.priceCents == null) {
    return "";
  }
  const pesos = centsToPesos(product.priceCents);
  return pesos === 0 ? "" : pesos;
}

function PriceField({
  product,
  priceValue,
  onPriceChange,
}: Readonly<{
  product?: Pick<ProductFormValues, "priceCents">;
  priceValue?: string;
  onPriceChange?: (value: string) => void;
}>) {
  const controlled = onPriceChange
    ? {
        value: priceValue ?? "",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          onPriceChange(event.target.value),
      }
    : { defaultValue: priceDefaultValue(product) };

  return (
    <div className="space-y-2">
      <Label htmlFor="price">Price (₱)</Label>
      <Input
        id="price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        required
        placeholder="0"
        className="min-h-11"
        {...controlled}
      />
    </div>
  );
}

function EditCostField({ costCents }: Readonly<{ costCents?: number }>) {
  return (
    <div className="space-y-2">
      <Label htmlFor="cost-display">Cost (₱)</Label>
      <input
        type="hidden"
        name="cost"
        value={costCents == null ? "0" : String(centsToPesos(costCents))}
      />
      <p
        id="cost-display"
        className="flex min-h-11 items-center rounded-lg border border-border/70 bg-muted/40 px-3 text-sm tabular-nums"
      >
        {formatPesos(costCents ?? 0)}
      </p>
      <p className="text-xs text-muted-foreground">
        Updated when you save the recipe above.
      </p>
    </div>
  );
}

function CreateCostField({
  computedCostCents,
}: Readonly<{ computedCostCents?: number | null }>) {
  if (computedCostCents == null) {
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">Cost (₱)</p>
        <p className="text-sm text-muted-foreground">
          Add recipe ingredients above to calculate food cost.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Cost (₱)</p>
      <p className="flex min-h-11 items-center rounded-lg border border-border/70 bg-muted/40 px-3 text-sm tabular-nums">
        {formatPesos(computedCostCents)}
      </p>
      <p className="text-xs text-muted-foreground">
        Live from the recipe ingredients above.
      </p>
    </div>
  );
}

export function ProductPricingAmountFields({
  isEdit,
  product,
  computedCostCents,
  priceValue,
  onPriceChange,
}: Readonly<ProductPricingAmountFieldsProps>) {
  return (
    <>
      <PriceField
        product={product}
        priceValue={priceValue}
        onPriceChange={onPriceChange}
      />
      {isEdit ? (
        <EditCostField costCents={product?.costCents} />
      ) : (
        <CreateCostField computedCostCents={computedCostCents} />
      )}
    </>
  );
}
