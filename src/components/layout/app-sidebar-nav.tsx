"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { AppNavSectionList } from "@/components/layout/app-nav-section-list";
import { navLinksBySection } from "@/components/layout/nav-links";

import type { RoleValue } from "@/enums";

interface AppSidebarNavProps {
  role: RoleValue;
  collapsed?: boolean;
}

function sidebarLinkClass(isActive: boolean, collapsed: boolean) {
  return cn(
    "inline-flex min-h-11 items-center rounded-xl text-sm transition-colors",
    // Keep focus inside the pill so the global ring-offset does not box the whole row.
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-offset-0",
    collapsed ? "w-full justify-center px-0" : "w-full gap-2.5 px-3",
    isActive
      ? "bg-primary font-medium text-primary-foreground shadow-sm focus-visible:ring-primary-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring",
  );
}

export function AppSidebarNav({
  role,
  collapsed = false,
}: Readonly<AppSidebarNavProps>) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <AppNavSectionList
        groups={navLinksBySection(role)}
        pathname={pathname}
        linkClassName={(isActive) => sidebarLinkClass(isActive, collapsed)}
        collapsed={collapsed}
        className="space-y-5"
      />
    </nav>
  );
}
