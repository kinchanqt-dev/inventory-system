export const SUPPORTED_CURRENCIES = [
  { value: "₱", label: "Pesos (₱)" },
] as const;

export type SupportedCurrencySymbol =
  (typeof SUPPORTED_CURRENCIES)[number]["value"];

export const DEFAULT_CURRENCY_SYMBOL: SupportedCurrencySymbol = "₱";
