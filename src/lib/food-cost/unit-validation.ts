import {
  areUnitsCompatible,
  isCatalogUnit,
  isKnownUnit,
} from "@/lib/food-cost/units";

export function validateCatalogUnit(code: string): string | null {
  if (!isCatalogUnit(code)) {
    return `Unknown unit "${code}". Choose a unit from the list.`;
  }
  return null;
}

export function validateKnownOrCatalogUnit(code: string): string | null {
  if (!isKnownUnit(code)) {
    return `Unknown unit "${code}". Choose a unit from the list.`;
  }
  return null;
}

export function validateCompatibleUnits(
  usageUnit: string,
  packOrBatchUnit: string,
): string | null {
  const usageError = validateKnownOrCatalogUnit(usageUnit);
  if (usageError) {
    return usageError;
  }
  const packError = validateKnownOrCatalogUnit(packOrBatchUnit);
  if (packError) {
    return packError;
  }
  if (!areUnitsCompatible(usageUnit, packOrBatchUnit)) {
    return `Cannot use ${usageUnit} with pack/batch unit ${packOrBatchUnit} (different measurement kinds).`;
  }
  return null;
}
