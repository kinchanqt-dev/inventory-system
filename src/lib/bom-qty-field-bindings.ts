import type { UnitDefinition } from "@/lib/food-cost/units";

interface BomQtyFieldBindingsInput {
  index: number;
  idPrefix: string;
  qty: number;
  unit: string;
  unitOptions?: UnitDefinition[];
  canRemove: boolean;
  removeLabel: string;
  onQtyChange: (index: number, qty: number) => void;
  onUnitChange: (index: number, unit: string) => void;
  onRemove: (index: number) => void;
}

export function bomQtyFieldBindings({
  index,
  idPrefix,
  qty,
  unit,
  unitOptions,
  canRemove,
  removeLabel,
  onQtyChange,
  onUnitChange,
  onRemove,
}: BomQtyFieldBindingsInput) {
  return {
    index,
    idPrefix,
    qty,
    unit,
    unitOptions,
    canRemove,
    removeLabel,
    onQtyChange: (nextQty: number) => onQtyChange(index, nextQty),
    onUnitChange: (nextUnit: string) => onUnitChange(index, nextUnit),
    onRemove: () => onRemove(index),
  };
}
