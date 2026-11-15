import Link from "next/link";
import {
  AlertTriangle,
  Package,
  PhilippinePeso,
  Receipt,
} from "lucide-react";
import { Suspense } from "react";

import { formatPesos } from "@/lib/money";
import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { Button } from "@/components/ui";

import { listLowStock } from "@/features/inventory";
import { getDashboardStats, listRecentSales } from "@/features/sales";
import {
  DashboardLowStockSection,
  DashboardPaymentMixSection,
  DashboardRecentSalesSection,
} from "@/features/sales/components/dashboard-sections";

import type { LucideIcon } from "lucide-react";

const METRIC_BORDER_CLASS =
  "border-border/80 px-4 py-4 sm:border-r sm:px-5 sm:py-5 nth-[-n+2]:border-b sm:nth-[-n+2]:border-b-0";

function metricCellClass(index: number) {
  if (index % 2 === 0) {
    return METRIC_BORDER_CLASS;
  }

  return `${METRIC_BORDER_CLASS} sm:last:border-r-0`;
}

function DashboardToolbar() {
  return (
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
  );
}

async function DashboardPageContent() {
  await requireRole(["OWNER", "CASHIER"]);
  const [stats, recentSales, lowStock] = await Promise.all([
    getDashboardStats(),
    listRecentSales(5),
    listLowStock(),
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
    <div className="space-y-6">
      <section
        aria-label="Key metrics"
        className="grid grid-cols-2 overflow-hidden rounded-lg border border-border/70 bg-card/70 shadow-sm sm:grid-cols-4"
      >
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className={metricCellClass(index)}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                  {metric.value}
                </p>
                <span className="mt-0.5 rounded-lg bg-muted/80 p-2 text-muted-foreground">
                  <Icon className="size-4 shrink-0" aria-hidden />
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {metric.label}
              </p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPaymentMixSection byMethod={stats.byMethod} />
        <DashboardLowStockSection lowStock={lowStock} />
      </div>

      <DashboardRecentSalesSection recentSales={recentSales} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <DashboardToolbar />
      <Suspense fallback={<PageBodySkeleton />}>
        <DashboardPageContent />
      </Suspense>
    </>
  );
}
