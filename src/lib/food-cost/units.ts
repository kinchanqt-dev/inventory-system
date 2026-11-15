export type UnitBaseKind = "weight" | "volume" | "count";

export interface UnitDefinition {
  code: string;
  baseKind: UnitBaseKind;
  toBase: number;
}

/** Lean metric catalog for PH food ops (UI selects + new org seeds). */
export const CATALOG_UNITS: UnitDefinition[] = [
  { code: "g", baseKind: "weight", toBase: 1 },
  { code: "kg", baseKind: "weight", toBase: 1000 },
  { code: "ml", baseKind: "volume", toBase: 1 },
  { code: "l", baseKind: "volume", toBase: 1000 },
  { code: "tsp", baseKind: "volume", toBase: 4.92892 },
  { code: "tbsp", baseKind: "volume", toBase: 14.7868 },
  { code: "cup", baseKind: "volume", toBase: 236.588 },
  { code: "pc", baseKind: "count", toBase: 1 },
  { code: "dozen", baseKind: "count", toBase: 12 },
  { code: "portion", baseKind: "count", toBase: 1 },
];

/** Legacy codes kept for conversion of existing ingredient/recipe rows. */
const LEGACY_UNITS: UnitDefinition[] = [
  { code: "oz", baseKind: "weight", toBase: 28.3495 },
  { code: "lb", baseKind: "weight", toBase: 453.592 },
  { code: "fl oz", baseKind: "volume", toBase: 29.5735 },
  { code: "each", baseKind: "count", toBase: 1 },
  { code: "slice", baseKind: "count", toBase: 1 },
];

/** Full conversion table (catalog + legacy). Prefer CATALOG_UNITS for UI. */
export const DEFAULT_UNITS: UnitDefinition[] = [
  ...CATALOG_UNITS,
  ...LEGACY_UNITS,
];

function normalizeUnitCode(code: string) {
  return code.trim().toLowerCase();
}

export function findUnit(
  units: UnitDefinition[],
  code: string,
): UnitDefinition | undefined {
  const needle = normalizeUnitCode(code);
  return units.find((unit) => normalizeUnitCode(unit.code) === needle);
}

export function compatibleCatalogUnits(
  packOrBatchUnit: string,
): UnitDefinition[] {
  const kind = findUnit(DEFAULT_UNITS, packOrBatchUnit)?.baseKind;
  if (!kind) {
    return CATALOG_UNITS;
  }
  return CATALOG_UNITS.filter((unit) => unit.baseKind === kind);
}

export function isKnownUnit(
  code: string,
  units: UnitDefinition[] = DEFAULT_UNITS,
): boolean {
  return Boolean(findUnit(units, code));
}

export function isCatalogUnit(code: string): boolean {
  return isKnownUnit(code, CATALOG_UNITS);
}

export function areUnitsCompatible(
  fromUnit: string,
  toUnit: string,
  units: UnitDefinition[] = DEFAULT_UNITS,
): boolean {
  const from = findUnit(units, fromUnit);
  const to = findUnit(units, toUnit);
  if (!from || !to) {
    return false;
  }
  return from.baseKind === to.baseKind;
}

function assertCompatibleUnits(
  from: UnitDefinition,
  to: UnitDefinition,
  fromUnit: string,
  toUnit: string,
) {
  if (from.baseKind === to.baseKind) {
    return;
  }
  throw new Error(
    `Cannot convert ${fromUnit} (${from.baseKind}) to ${toUnit} (${to.baseKind})`,
  );
}

function requireUnit(
  units: UnitDefinition[],
  code: string,
): UnitDefinition {
  const unit = findUnit(units, code);
  if (!unit) {
    throw new Error(`Unknown unit: ${code}`);
  }
  return unit;
}

export function convertQuantity(
  qty: number,
  fromUnit: string,
  toUnit: string,
  units: UnitDefinition[] = DEFAULT_UNITS,
): number {
  if (qty === 0) return 0;
  const from = requireUnit(units, fromUnit);
  const to = requireUnit(units, toUnit);
  assertCompatibleUnits(from, to, fromUnit, toUnit);
  return (qty * from.toBase) / to.toBase;
}
