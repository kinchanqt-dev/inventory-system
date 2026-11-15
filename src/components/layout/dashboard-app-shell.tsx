import { Suspense } from "react";

import { appShellSessionProps } from "@/lib/app-shell-session";
import { requireSession } from "@/lib/session";

import { AppShell } from "@/components/layout/app-shell";
import { PageBodySkeleton } from "@/components/layout/app-shell-skeleton";

import { getShopBranding } from "@/features/settings";

interface DashboardAppShellProps {
  children: React.ReactNode;
}

async function DashboardAppShellInner({
  children,
}: Readonly<DashboardAppShellProps>) {
  const [session, branding] = await Promise.all([
    requireSession(),
    getShopBranding(),
  ]);

  return (
    <AppShell {...appShellSessionProps(session)} branding={branding}>
      <Suspense fallback={<PageBodySkeleton />}>{children}</Suspense>
    </AppShell>
  );
}

export function DashboardAppShell({
  children,
}: Readonly<DashboardAppShellProps>) {
  return <DashboardAppShellInner>{children}</DashboardAppShellInner>;
}
