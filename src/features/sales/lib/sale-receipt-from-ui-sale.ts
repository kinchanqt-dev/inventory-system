import type { UiSale } from "@/lib/mappers";
import type { SaleReceiptData } from "@/features/sales/types/sale-receipt.types";

export function saleReceiptFromUiSale(sale: UiSale): SaleReceiptData {
  return {
    saleNumber: sale.saleNumber,
    status: sale.status,
    createdAt: sale.createdAt,
    subtotalCents: sale.subtotalCents,
    discountCents: sale.discountCents,
    totalCents: sale.totalCents,
    paymentMethod: sale.paymentMethod,
    paymentNote: sale.paymentNote,
    amountTenderedCents: sale.amountTenderedCents,
    changeCents: sale.changeCents,
    cashierName: sale.cashier?.name ?? null,
    items: (sale.items ?? []).map((item) => ({
      id: item.id,
      productName: item.productName,
      productSku: item.productSku,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      lineTotalCents: item.lineTotalCents,
    })),
  };
}
