"use client";

import { Trash2 } from "lucide-react";

import { Button, Input, Label } from "@/components/ui";

import { UnitSelect } from "@/components/shared/unit-select";

import { CATALOG_UNITS, type UnitDefinition } from "@/lib/food-cost/units";

interface BomLineQtyFieldsProps {
  index: number;
  idPrefix: string;
  qty: number;
  unit: string;
  unitOptions?: UnitDefinition[];
  canRemove: boolean;
  onQtyChange: (qty: number) => void;
  onUnitChange: (unit: string) => void;
  onRemove: () => void;
  removeLabel: string;
}

export function BomLineQtyFields({
  index,
  idPrefix,
  qty,
  unit,
  unitOptions = CATALOG_UNITS,
  canRemove,
  onQtyChange,
  onUnitChange,
  onRemove,
  removeLabel,
}: Readonly<BomLineQtyFieldsProps>) {
  const qtyId = `${idPrefix}-qty-${index}`;
  const unitId = `${idPrefix}-unit-${index}`;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={qtyId}>Qty</Label>
        <Input
          id={qtyId}
          type="number"
          min="0.000001"
          step="any"
          required
          value={qty || ""}
          placeholder="0"
          onChange={(event) => onQtyChange(Number(event.target.value) || 0)}
          className="min-h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={unitId}>Unit</Label>
        <UnitSelect
          id={unitId}
          value={unit}
          onValueChange={onUnitChange}
          units={unitOptions}
        />
      </div>

      <div className="flex items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          aria-label={removeLabel}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </>
  );
}
