import Link from "next/link";
import {
  AlertTriangle,
  Package,
  PhilippinePeso,
  Receipt,
  ShoppingCart,
} from "lucide-react";

import { formatPesos } from "@/lib/money";
import { requireSession } from "@/lib/session";
import { PAYMENT_METHOD_LABELS } from "@/enums";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageSection } from "@/components/shared";
import { Badge, Button } from "@/components/ui";

import { listLowStock } from "@/features/inventory";
import { getDashboardStats, listRecentSales } from "@/features/sales";
import { getShopBranding } from "@/features/settings";

import type { LucideIcon } from "lucide-react";
import type { PaymentMethodValue } from "@/enums";

export const instant = false;

const METRIC_BORDER_CLASS =
  "border-border/80 px-4 py-4 sm:border-r sm:px-5 sm:py-5 nth-[-n+2]:border-b sm:nth-[-n+2]:border-b-0";

function metricCellClass(index: number) {
  if (index % 2 === 0) {
    return METRIC_BORDER_CLASS;
  }

  return `${METRIC_BORDER_CLASS} sm:last:border-r-0`;
}

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

export default async function DashboardPage() {
  const session = await requireSession();
  const [stats, recentSales, lowStock, branding] = await Promise.all([
    getDashboardStats(),
    listRecentSales(5),
    listLowStock(),
    getShopBranding(),
  ]);

  const metrics: {
    label: string;
    value: string;
    icon: LucideIcon;
  }[] = [
    {
      label: "Today's revenue",
      value: formatPesos(stats.revenueCents),
      icon: PhilippinePeso,
    },
    {
      label: "Sales today",
      value: String(stats.completedToday),
      icon: Receipt,
    },
    {
      label: "Active products",
      value: String(stats.productCount),
      icon: Package,
    },
    {
      label: "Low stock items",
      value: String(stats.lowStockCount),
      icon: AlertTriangle,
    },
  ];

  return (
    <AppShell
      name={session.user.name ?? "User"}
      role={session.user.role}
      title="Dashboard"
      branding={branding}
    >
      <PageToolbar
        description="A quick look at today’s sales and stock"
        actions={
          <Button
            nativeButton={false}
            render={<Link href="/pos" />}
            className="min-h-11"
          >
            Open POS
          </Button>
        }
      />

      <div className="space-y-6">
        <section
          aria-label="Key metrics"
          className="grid grid-cols-2 overflow-hidden rounded-xl border border-border/80 sm:grid-cols-4"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className={metricCellClass(index)}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                    {metric.value}
                  </p>
                  <Icon
                    className="mt-1 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            );
          })}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <PageSection
            title="How customers paid today"
            description="Cash, GCash, and other methods from checkout"
            titleId="payment-mix-heading"
          >
            {Object.keys(stats.byMethod).length === 0 ? (
              <DashboardEmptyCta message="No sales yet today" />
            ) : (
              <ul className="divide-y divide-border/70">
                {Object.entries(stats.byMethod).map(([method, amount]) => (
                  <li
                    key={method}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span>
                      {PAYMENT_METHOD_LABELS[method as PaymentMethodValue] ??
                        method}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPesos(amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>

          <PageSection
            title="Low stock"
            description="Needs restocking soon"
            titleId="low-stock-heading"
          >
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">Stock looks healthy</p>
            ) : (
              <ul className="divide-y divide-border/70">
                {lowStock.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <Link
                      href="/inventory"
                      className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.product.name}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {item.product.sku}
                        </p>
                      </div>
                      <Badge variant="destructive">{item.quantity} left</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </PageSection>
        </div>

        <PageSection
          title="Recent sales"
          description="Most recent completed sales"
          titleId="recent-sales-heading"
        >
          {recentSales.length === 0 ? (
            <DashboardEmptyCta message="Completed sales will show up here" />
          ) : (
            <ul className="divide-y divide-border/70">
              {recentSales.map((sale) => (
                <li
                  key={sale.id}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{sale.saleNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {PAYMENT_METHOD_LABELS[sale.paymentMethod]} ·{" "}
                      {sale.cashier.name}
                    </p>
                  </div>
                  <span className="font-semibold tabular-nums">
                    {formatPesos(sale.totalCents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      </div>
    </AppShell>
  );
}
