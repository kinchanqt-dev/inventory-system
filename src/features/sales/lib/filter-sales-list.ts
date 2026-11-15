import { matchesSearchFields } from "@/lib/search-fields";

interface SaleFilterRow {
  saleNumber: string;
  paymentMethod: string;
  cashier: { name: string } | null;
}

export function filterSalesList<T extends SaleFilterRow>(
  sales: T[],
  query: string,
  paymentLabel: (method: string) => string,
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return sales;
  }

  return sales.filter((sale) =>
    matchesSearchFields(
      [
        sale.saleNumber,
        sale.cashier?.name ?? "Staff",
        paymentLabel(sale.paymentMethod),
      ],
      normalized,
    ),
  );
}
