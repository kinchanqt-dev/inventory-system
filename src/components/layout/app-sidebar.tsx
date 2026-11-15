"use client";

import { cn } from "@/lib/utils";
import { useSidebarCollapse } from "@/hooks/use-sidebar-collapse.hooks";

import { AppSidebarBrand } from "@/components/layout/app-sidebar-brand";
import { AppSidebarFooter } from "@/components/layout/app-sidebar-footer";
import { AppSidebarNav } from "@/components/layout/app-sidebar-nav";

import type { RoleValue } from "@/enums";
import type { ShopBranding } from "@/features/settings";

interface AppSidebarProps {
  name: string;
  role: RoleValue;
  branding: ShopBranding;
  isPlatformAdmin?: boolean;
}

export function AppSidebar({
  name,
  role,
  branding,
  isPlatformAdmin = false,
}: Readonly<AppSidebarProps>) {
  const { collapsed, toggleCollapsed } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-card/70 py-4 backdrop-blur-md transition-[width] duration-200 md:flex",
        collapsed ? "w-19 px-2" : "w-64 px-3",
      )}
    >
      <AppSidebarBrand
        name={name}
        role={role}
        branding={branding}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <AppSidebarNav role={role} collapsed={collapsed} />
      </div>

      <AppSidebarFooter
        collapsed={collapsed}
        isPlatformAdmin={isPlatformAdmin}
      />
    </aside>
  );
}
