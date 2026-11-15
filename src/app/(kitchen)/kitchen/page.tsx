import Link from "next/link";

import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/enums";

import { OpsSurfaceShell } from "@/components/layout/ops-surface-shell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { KitchenBoard, listOpenKitchenTickets } from "@/features/kitchen";
import { getShopBranding } from "@/features/settings";

import type { RoleValue } from "@/enums";

export const instant = false;

export default async function KitchenPage() {
  const session = await requireRole(["OWNER", "CASHIER", "COOK"]);
  const isCookOnly = session.user.role === "COOK";
  const [tickets, branding] = await Promise.all([
    listOpenKitchenTickets(),
    getShopBranding(),
  ]);

  return (
    <OpsSurfaceShell
      className="min-h-screen bg-background pb-8"
      branding={branding}
      subtitle={`Kitchen board · ${session.user.name} · ${ROLE_LABELS[session.user.role as RoleValue]}`}
      isSupportMode={session.isSupportMode}
      organizationName={session.organization.name}
      actions={
        <>
          <ThemeToggle />
          {!isCookOnly ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="min-h-11"
                nativeButton={false}
                render={<Link href="/" />}
                title="Back to dashboard"
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-h-11"
                nativeButton={false}
                render={<Link href="/pos" />}
              >
                POS
              </Button>
            </>
          ) : null}
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="min-h-11">
              Sign out
            </Button>
          </form>
        </>
      }
    >
      <main className="mx-auto w-full max-w-kitchen px-4 py-4 sm:px-6 sm:py-6">
        <h1 className="sr-only">Kitchen display</h1>
        <KitchenBoard
          organizationId={session.organization.id}
          initialTickets={tickets}
        />
      </main>
    </OpsSurfaceShell>
  );
}
