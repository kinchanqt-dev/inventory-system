export function pesosToCents(value: number | string): number {
  const amount = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(amount)) {
    throw new TypeError("Invalid money amount");
  }

  return Math.round(amount * 100);
}

export function centsToPesos(cents: number): number {
  return cents / 100;
}

export function formatPesos(cents: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(centsToPesos(cents));
}
