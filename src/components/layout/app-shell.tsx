import { AppHeader } from "@/components/layout/app-header";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { PageViewTransition } from "@/components/shared/page-view-transition";

import { SupportModeBanner } from "@/features/platform-admin/components/support-mode-banner";

import type { ShopBranding } from "@/features/settings";
import type { RoleValue } from "@/enums";

interface AppShellProps {
  children: React.ReactNode;
  name: string;
  role: RoleValue;
  title: string;
  branding: ShopBranding;
  isPlatformAdmin?: boolean;
  isSupportMode?: boolean;
  supportOrganizationName?: string;
}

export function AppShell({
  children,
  name,
  role,
  title,
  branding,
  isPlatformAdmin = false,
  isSupportMode = false,
  supportOrganizationName,
}: Readonly<AppShellProps>) {
  return (
    <PageViewTransition>
      <div className="min-h-screen bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-accent,#2f5d50)_5%,var(--background)),var(--background)_28%)]">
        {isSupportMode && supportOrganizationName ? (
          <SupportModeBanner organizationName={supportOrganizationName} />
        ) : null}

        <div className="mx-auto flex min-h-screen w-full max-w-360">
          <AppSidebar
            name={name}
            role={role}
            branding={branding}
            isPlatformAdmin={isPlatformAdmin}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader
              name={name}
              role={role}
              title={title}
              branding={branding}
              isPlatformAdmin={isPlatformAdmin}
            />

            <main className="flex-1 px-4 py-5 pb-24 sm:px-6 sm:py-6 md:pb-6">
              <div className="mb-5 md:hidden">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
              </div>
              {children}
            </main>

            <AppMobileNav role={role} />
          </div>
        </div>
      </div>
    </PageViewTransition>
  );
}
