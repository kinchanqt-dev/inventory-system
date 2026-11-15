import type { PaymentMethodValue } from "@/enums";

export interface SaleReceiptItem {
  id: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface SaleReceiptData {
  saleNumber: string;
  status?: string;
  createdAt: Date | string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  paymentMethod: PaymentMethodValue | string;
  paymentNote: string | null;
  amountTenderedCents: number | null;
  changeCents: number | null;
  cashierName?: string | null;
  kitchenTicketNumber?: string | null;
  items: SaleReceiptItem[];
}
