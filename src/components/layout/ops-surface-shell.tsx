import { PageViewTransition } from "@/components/shared/page-view-transition";

import { BrandMark } from "@/features/settings/components/brand-mark";
import { OptionalSupportBanner } from "@/features/platform-admin/components/optional-support-banner";

import type { ShopBranding } from "@/features/settings";

interface OpsSurfaceShellProps {
  children: React.ReactNode;
  branding: ShopBranding;
  subtitle: string;
  actions: React.ReactNode;
  isSupportMode: boolean;
  organizationName: string;
  className: string;
}

export function OpsSurfaceShell({
  children,
  branding,
  subtitle,
  actions,
  isSupportMode,
  organizationName,
  className,
}: Readonly<OpsSurfaceShellProps>) {
  return (
    <PageViewTransition>
      <div className={className}>
        <OptionalSupportBanner
          isSupportMode={isSupportMode}
          organizationName={organizationName}
        />
        <header className="sticky top-0 z-20 flex flex-col gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="min-w-0 space-y-1">
            <BrandMark branding={branding} size="md" />
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        </header>
        {children}
      </div>
    </PageViewTransition>
  );
}
