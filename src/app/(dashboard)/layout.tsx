import { Suspense } from "react";

import { AppShellSkeleton } from "@/components/layout/app-shell-skeleton";
import { DashboardAppShell } from "@/components/layout/dashboard-app-shell";

export default function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<AppShellSkeleton />}>
      <DashboardAppShell>{children}</DashboardAppShell>
    </Suspense>
  );
}
