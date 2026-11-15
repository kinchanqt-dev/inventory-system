"use client";

import type { ChangeEvent } from "react";

import { Button, Input, Label } from "@/components/ui";

interface ProductPricingOpeningStockProps {
  quantity?: number;
  quantityValue?: string;
  onQuantityChange?: (value: string) => void;
  maxMakeable?: number | null;
  quantityError?: string | null;
}

function ZeroStockHint() {
  return (
    <p className="text-xs text-muted-foreground">
      Nothing is makeable from current ingredient stock.
    </p>
  );
}

function SuggestedStockHint({
  maxMakeable,
  onApplySuggested,
}: Readonly<{
  maxMakeable: number;
  onApplySuggested?: () => void;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-xs text-muted-foreground">
        Suggested: {maxMakeable} from current ingredient stock
      </p>
      {onApplySuggested ? (
        <Button
          type="button"
          variant="ghost"
          size="xs"
          className="h-auto px-1.5 py-0.5 text-xs"
          onClick={onApplySuggested}
        >
          Use {maxMakeable}
        </Button>
      ) : null}
    </div>
  );
}

function OpeningStockHint({
  maxMakeable,
  onApplySuggested,
}: Readonly<{
  maxMakeable: number;
  onApplySuggested?: () => void;
}>) {
  if (maxMakeable === 0) {
    return <ZeroStockHint />;
  }
  return (
    <SuggestedStockHint
      maxMakeable={maxMakeable}
      onApplySuggested={onApplySuggested}
    />
  );
}

function ControlledOpeningStockInput({
  quantityValue,
  onQuantityChange,
  maxMakeable,
  quantityError,
}: Readonly<{
  quantityValue?: string;
  onQuantityChange: (value: string) => void;
  maxMakeable?: number | null;
  quantityError?: string | null;
}>) {
  return (
    <Input
      id="quantity"
      name="quantity"
      type="number"
      min="0"
      max={maxMakeable ?? undefined}
      placeholder="0"
      className="min-h-11"
      aria-invalid={quantityError ? true : undefined}
      aria-describedby="quantityHelp"
      value={quantityValue ?? ""}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        onQuantityChange(event.target.value);
      }}
    />
  );
}

function UncontrolledOpeningStockInput({
  quantity,
  maxMakeable,
}: Readonly<{
  quantity?: number;
  maxMakeable?: number | null;
}>) {
  return (
    <Input
      id="quantity"
      name="quantity"
      type="number"
      min="0"
      max={maxMakeable ?? undefined}
      placeholder="0"
      className="min-h-11"
      aria-describedby="quantityHelp"
      defaultValue={quantity ?? ""}
    />
  );
}

function OpeningStockFieldInput(props: Readonly<ProductPricingOpeningStockProps>) {
  if (props.onQuantityChange) {
    return (
      <ControlledOpeningStockInput
        quantityValue={props.quantityValue}
        onQuantityChange={props.onQuantityChange}
        maxMakeable={props.maxMakeable}
        quantityError={props.quantityError}
      />
    );
  }
  return (
    <UncontrolledOpeningStockInput
      quantity={props.quantity}
      maxMakeable={props.maxMakeable}
    />
  );
}

function OpeningStockHelp({
  maxMakeable,
  quantityError,
  onApplySuggested,
}: Readonly<{
  maxMakeable?: number | null;
  quantityError?: string | null;
  onApplySuggested?: () => void;
}>) {
  return (
    <div id="quantityHelp" className="space-y-1">
      {maxMakeable == null ? null : (
        <OpeningStockHint
          maxMakeable={maxMakeable}
          onApplySuggested={onApplySuggested}
        />
      )}
      {quantityError ? (
        <p className="text-xs text-destructive">{quantityError}</p>
      ) : null}
    </div>
  );
}

function applySuggestedHandler(
  onQuantityChange: ((value: string) => void) | undefined,
  maxMakeable: number | null | undefined,
) {
  if (!onQuantityChange) {
    return undefined;
  }
  if (maxMakeable == null) {
    return undefined;
  }
  return () => onQuantityChange(String(maxMakeable));
}

export function ProductPricingOpeningStock(
  props: Readonly<ProductPricingOpeningStockProps>,
) {
  return (
    <div className="space-y-2">
      <Label htmlFor="quantity">Opening stock</Label>
      <OpeningStockFieldInput {...props} />
      <OpeningStockHelp
        maxMakeable={props.maxMakeable}
        quantityError={props.quantityError}
        onApplySuggested={applySuggestedHandler(
          props.onQuantityChange,
          props.maxMakeable,
        )}
      />
    </div>
  );
}
