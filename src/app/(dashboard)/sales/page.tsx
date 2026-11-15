import Link from "next/link";
import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { Button } from "@/components/ui";

import { listSalesHistory, SalesTable } from "@/features/sales";
import { getShopBranding } from "@/features/settings";

function SalesPageChrome() {
  return (
    <PageToolbar
      description="Past sales with how the customer paid (Cash, QRPh, GCash, Maya, Card, or Other)."
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

async function SalesPageContent() {
  await requireRole(["OWNER", "CASHIER"]);
  const [sales, branding] = await Promise.all([
    listSalesHistory(250),
    getShopBranding(),
  ]);
  return <SalesTable sales={sales} shopName={branding.shopTitle} />;
}

export default function SalesPage() {
  return (
    <>
      <SalesPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <SalesPageContent />
      </Suspense>
    </>
  );
}
