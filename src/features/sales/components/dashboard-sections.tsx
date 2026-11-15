import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { formatPesos } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import { PageSection } from "@/components/shared";
import { Badge, Button } from "@/components/ui";

import type { PaymentMethodValue } from "@/enums";

function DashboardEmptyCta({ message }: Readonly<{ message: string }>) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button
        nativeButton={false}
        render={<Link href="/pos" />}
        className="min-h-11"
      >
        <ShoppingCart className="size-4" aria-hidden />
        Record the first sale
      </Button>
    </div>
  );
}

function paymentMethodLabel(method: string) {
  return PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ?? method;
}

export function DashboardPaymentMixSection({
  byMethod,
}: Readonly<{ byMethod: Record<string, number> }>) {
  const entries = Object.entries(byMethod);

  return (
    <PageSection
      title="How customers paid today"
      description="Cash, GCash, and other methods from checkout"
      titleId="payment-mix-heading"
    >
      {entries.length === 0 ? (
        <DashboardEmptyCta message="No sales yet today" />
      ) : (
        <ul className="divide-y divide-border/70">
          {entries.map(([method, amount]) => (
            <li
              key={method}
              className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span>{paymentMethodLabel(method)}</span>
              <span className="font-semibold tabular-nums">
                {formatPesos(amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </PageSection>
  );
}

interface LowStockItem {
  id: string;
  quantity: number;
  product: { name: string; sku: string };
}

export function DashboardLowStockSection({
  lowStock,
}: Readonly<{ lowStock: LowStockItem[] }>) {
  if (lowStock.length === 0) {
    return (
      <PageSection
        title="Low stock"
        description="Needs restocking soon"
        titleId="low-stock-heading"
      >
        <p className="text-sm text-muted-foreground">Stock looks healthy</p>
      </PageSection>
    );
  }

  return (
    <PageSection
      title="Low stock"
      description="Needs restocking soon"
      titleId="low-stock-heading"
    >
      <ul className="divide-y divide-border/70">
        {lowStock.slice(0, 6).map((item) => (
          <li key={item.id}>
            <Link
              href="/inventory"
              className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.product.name}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {item.product.sku}
                </p>
              </div>
              <Badge variant="destructive">{item.quantity} left</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}

interface RecentSaleRow {
  id: string;
  saleNumber: string;
  totalCents: number;
  paymentMethod: string;
  cashier: { name: string } | null;
}

function saleCashierLabel(cashier: RecentSaleRow["cashier"]) {
  if (cashier?.name) {
    return cashier.name;
  }
  return "Staff";
}

export function DashboardRecentSalesSection({
  recentSales,
}: Readonly<{ recentSales: RecentSaleRow[] }>) {
  if (recentSales.length === 0) {
    return (
      <PageSection
        title="Recent sales"
        description="Most recent completed sales"
        titleId="recent-sales-heading"
      >
        <DashboardEmptyCta message="Completed sales will show up here" />
      </PageSection>
    );
  }

  return (
    <PageSection
      title="Recent sales"
      description="Most recent completed sales"
      titleId="recent-sales-heading"
    >
      <ul className="divide-y divide-border/70">
        {recentSales.map((sale) => (
          <li
            key={sale.id}
            className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="font-medium">{sale.saleNumber}</p>
              <p className="text-xs text-muted-foreground">
                {paymentMethodLabel(sale.paymentMethod)} ·{" "}
                {saleCashierLabel(sale.cashier)}
              </p>
            </div>
            <span className="font-semibold tabular-nums">
              {formatPesos(sale.totalCents)}
            </span>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
