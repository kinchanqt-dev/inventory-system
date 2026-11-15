"use client";

import { usePathname } from "next/navigation";

import { dashboardTitleForPath } from "@/components/layout/nav-links";

export function DashboardPathTitle() {
  const pathname = usePathname();
  return <>{dashboardTitleForPath(pathname)}</>;
}
