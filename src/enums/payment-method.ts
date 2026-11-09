export const PAYMENT_METHODS = [
  "CASH",
  "QRPH",
  "GCASH",
  "MAYA",
  "CARD",
  "OTHER",
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodValue, string> = {
  CASH: "Cash",
  QRPH: "QRPh",
  GCASH: "GCash",
  MAYA: "Maya",
  CARD: "Card",
  OTHER: "Other",
};
