import { AppHeader } from "@/components/layout/app-header";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";

import type { ShopBranding } from "@/features/settings";

import type { RoleValue } from "@/enums";

interface AppShellProps {
  children: React.ReactNode;
  name: string;
  role: RoleValue;
  title: string;
  branding: ShopBranding;
}

export function AppShell({
  children,
  name,
  role,
  title,
  branding,
}: Readonly<AppShellProps>) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        name={name}
        role={role}
        title={title}
        branding={branding}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-6 md:pb-6">
        {children}
      </main>
      <AppMobileNav role={role} />
    </div>
  );
}
