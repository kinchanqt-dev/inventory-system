import Link from "next/link";

import { requireSession } from "@/lib/session";

import { AppShell, PageToolbar } from "@/components/layout";
import { Button } from "@/components/ui";

import { listSalesHistory, SalesTable } from "@/features/sales";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function SalesPage() {
  const session = await requireSession();
  const [sales, branding] = await Promise.all([
    listSalesHistory(250),
    getShopBranding(),
  ]);

  return (
    <AppShell
      name={session.user.name ?? "User"}
      role={session.user.role}
      title="Sales"
      branding={branding}
    >
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
      <SalesTable sales={sales} />
    </AppShell>
  );
}
