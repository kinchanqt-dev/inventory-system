import { formatPesos } from "@/lib/money";

export function posCartItemLabel(itemCount: number) {
  const noun = itemCount === 1 ? "item" : "items";
  return `${itemCount} ${noun}`;
}

export function posCheckoutButtonLabel(
  isPending: boolean,
  subtotalCents: number,
) {
  if (isPending) {
    return "Recording sale…";
  }
  return `Charge ${formatPesos(subtotalCents)}`;
}