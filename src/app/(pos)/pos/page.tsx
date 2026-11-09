import Link from "next/link";

import { requireSession } from "@/lib/session";
import { ROLE_LABELS } from "@/enums";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { PosTerminal } from "@/features/pos";
import { listActiveProductsForPos } from "@/features/products";
import { getShopBranding } from "@/features/settings";
import { BrandMark } from "@/features/settings/components/brand-mark";

import type { RoleValue } from "@/enums";

export const instant = false;

export default async function PosPage() {
  const session = await requireSession();
  const [products, branding] = await Promise.all([
    listActiveProductsForPos(),
    getShopBranding(),
  ]);

  return (
    <div className="min-h-screen bg-pos-surface pb-24 md:pb-0">
      <header className="sticky top-0 z-20 flex flex-col gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="min-w-0 space-y-1">
          <BrandMark branding={branding} size="md" />
          <p className="truncate text-sm text-muted-foreground">
            {session.user.name} ·{" "}
            {ROLE_LABELS[session.user.role as RoleValue]}
            {branding.tagline ? ` · ${branding.tagline}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      </header>
      <div className="px-4 py-4 sm:p-6">
        <h1 className="sr-only">Point of sale</h1>
        <PosTerminal products={products} />
      </div>
    </div>
  );
}
