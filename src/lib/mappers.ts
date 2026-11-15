import {
  mapProductRowToCoreFields,
  type ProductCoreCamelFields,
} from "@/features/products/lib/product-core-fields";

import type {
  Category,
  Product,
  Sale,
  StockItem,
} from "@/types/database.types";

/** UI-facing camelCase shapes kept for existing components. */
export interface UiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface UiStock {
  id: string;
  productId: string;
  quantity: number;
  reorderLevel: number;
}

export interface UiProduct extends ProductCoreCamelFields {
  category: UiCategory | null;
  stock: UiStock | null;
}

export interface UiSale {
  id: string;
  saleNumber: string;
  status: string;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  paymentMethod: "CASH" | "QRPH" | "GCASH" | "MAYA" | "CARD" | "OTHER";
  paymentNote: string | null;
  amountTenderedCents: number | null;
  changeCents: number | null;
  cashierId: string;
  createdAt: Date;
  cashier: { id: string; name: string; email?: string } | null;
  items?: Array<{
    id: string;
    productName: string;
    productSku: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }>;
}

export function mapCategory(row: Category): UiCategory {
  return { id: row.id, name: row.name, slug: row.slug };
}

function mapStock(row: StockItem): UiStock {
  return {
    id: row.id,
    productId: row.product_id,
    quantity: row.quantity,
    reorderLevel: row.reorder_level,
  };
}

function firstStockItem(
  stock: StockItem | StockItem[] | null | undefined,
): StockItem | null {
  if (!stock) {
    return null;
  }
  return Array.isArray(stock) ? stock[0] ?? null : stock;
}

export function mapProduct(
  row: Product & {
    category?: Category | null;
    stock_items?: StockItem | StockItem[] | null;
    stock?: StockItem | null;
  },
): UiProduct {
  const stock = firstStockItem(row.stock ?? row.stock_items);
  const category = row.category ? mapCategory(row.category) : null;

  return {
    ...mapProductRowToCoreFields(row),
    category,
    stock: stock ? mapStock(stock) : null,
  };
}

export function mapSale(
  row: Sale & {
    profiles?: { id: string; name: string } | null;
    sale_items?: Array<{
      id: string;
      product_name: string;
      product_sku: string;
      quantity: number;
      unit_price_cents: number;
      line_total_cents: number;
    }>;
  },
): UiSale {
  return {
    id: row.id,
    saleNumber: row.sale_number,
    status: row.status,
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    totalCents: row.total_cents,
    paymentMethod: row.payment_method as UiSale["paymentMethod"],
    paymentNote: row.payment_note,
    amountTenderedCents: row.amount_tendered_cents,
    changeCents: row.change_cents,
    cashierId: row.cashier_id,
    createdAt: new Date(row.created_at),
    cashier: row.profiles
      ? { id: row.profiles.id, name: row.profiles.name }
      : { id: row.cashier_id, name: "Staff" },
    items: row.sale_items?.map((item) => ({
      id: item.id,
      productName: item.product_name,
      productSku: item.product_sku,
      quantity: item.quantity,
      unitPriceCents: item.unit_price_cents,
      lineTotalCents: item.line_total_cents,
    })),
  };
}
