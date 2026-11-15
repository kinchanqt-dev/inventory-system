import Link from "next/link";

import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { Button } from "@/components/ui";

import { listSalesHistory, SalesTable } from "@/features/sales";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function SalesPage() {
  const session = await requireRole(["OWNER", "CASHIER"]);
  const [sales, branding] = await Promise.all([
    listSalesHistory(250),
    getShopBranding(),
  ]);

  return (
    <AppShell
      {...appShellSessionProps(session)}
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
      <SalesTable sales={sales} shopName={branding.shopTitle} />
    </AppShell>
  );
}
