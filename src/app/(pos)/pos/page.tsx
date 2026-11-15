import Link from "next/link";

import { requireRole } from "@/lib/session";
import { ROLE_LABELS } from "@/enums";

import { OpsSurfaceShell } from "@/components/layout/ops-surface-shell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { PosTerminal } from "@/features/pos";
import { listActiveProductsForPos } from "@/features/products";
import { getShopBranding } from "@/features/settings";

import type { RoleValue } from "@/enums";

export const instant = false;

function posSubtitle(
  name: string,
  role: RoleValue,
  tagline: string | null | undefined,
) {
  const base = `${name} · ${ROLE_LABELS[role]}`;
  if (!tagline) {
    return base;
  }
  return `${base} · ${tagline}`;
}

export default async function PosPage() {
  const session = await requireRole(["OWNER", "CASHIER"]);
  const [products, branding] = await Promise.all([
    listActiveProductsForPos(),
    getShopBranding(),
  ]);

  return (
    <OpsSurfaceShell
      className="min-h-screen bg-pos-surface pb-24 md:pb-0"
      branding={branding}
      subtitle={posSubtitle(
        session.user.name,
        session.user.role as RoleValue,
        branding.tagline,
      )}
      isSupportMode={session.isSupportMode}
      organizationName={session.organization.name}
      actions={
        <>
          <ThemeToggle />
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
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className="min-h-11">
              Sign out
            </Button>
          </form>
        </>
      }
    >
      <div className="px-4 py-4 sm:p-6">
        <h1 className="sr-only">Point of sale</h1>
        <PosTerminal products={products} shopName={branding.shopTitle} />
      </div>
    </OpsSurfaceShell>
  );
}
