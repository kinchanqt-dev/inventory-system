type ParsedOpening =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "value"; quantity: number };

function parseOpeningQuantity(value: string): ParsedOpening {
  const trimmed = value.trim();
  if (trimmed === "") {
    return { kind: "empty" };
  }
  const quantity = Number(trimmed);
  if (!Number.isFinite(quantity)) {
    return { kind: "invalid" };
  }
  return { kind: "value", quantity };
}

function overMaxError(
  quantity: number,
  maxMakeable: number | null | undefined,
): string | null {
  if (maxMakeable == null) {
    return null;
  }
  if (quantity <= maxMakeable) {
    return null;
  }
  return `Opening stock cannot exceed ${maxMakeable} from current ingredient stock.`;
}

function errorForValueQuantity(
  quantity: number,
  maxMakeable: number | null | undefined,
): string | null {
  if (quantity < 0) {
    return "Opening stock must be 0 or more.";
  }
  return overMaxError(quantity, maxMakeable);
}

export function openingStockError(
  quantityValue: string,
  maxMakeable: number | null | undefined,
): string | null {
  const parsed = parseOpeningQuantity(quantityValue);
  if (parsed.kind === "empty") {
    return null;
  }
  if (parsed.kind === "invalid") {
    return "Opening stock must be 0 or more.";
  }
  return errorForValueQuantity(parsed.quantity, maxMakeable);
}

function clampAgainstMax(
  value: string,
  quantity: number,
  maxMakeable: number | null | undefined,
): string {
  if (maxMakeable == null) {
    return value;
  }
  if (quantity <= maxMakeable) {
    return value;
  }
  return String(maxMakeable);
}

export function clampOpeningStockValue(
  value: string,
  maxMakeable: number | null | undefined,
): string {
  const parsed = parseOpeningQuantity(value);
  if (parsed.kind !== "value") {
    return value;
  }
  if (parsed.quantity < 0) {
    return "0";
  }
  return clampAgainstMax(value, parsed.quantity, maxMakeable);
}
