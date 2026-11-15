import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PageViewTransition } from "@/components/shared/page-view-transition";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { PlatformAdminNav } from "@/features/platform-admin/components/platform-admin-nav";

interface PlatformAdminShellProps {
  children: React.ReactNode;
  title: string;
  email: string;
  description?: string;
}

export function PlatformAdminShell({
  children,
  title,
  email,
  description,
}: Readonly<PlatformAdminShellProps>) {
  return (
    <PageViewTransition>
      <div className="min-h-screen bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-accent,#2f5d50)_5%,var(--background)),var(--background)_28%)]">
        <div className="mx-auto flex min-h-screen w-full max-w-360">
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/70 px-3 py-4 backdrop-blur-md md:flex">
            <div className="px-2 pb-5">
              <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Platform
              </p>
              <p className="font-heading text-xl font-semibold tracking-tight">
                Admin
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {email}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-0.5">
              <PlatformAdminNav orientation="vertical" />
            </div>

            <div className="mt-4 border-t border-border/60 px-0.5 pt-4">
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="min-h-11 w-full"
                >
                  Sign out
                </Button>
              </form>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <div className="min-w-0 md:hidden">
                  <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Platform admin
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {email}
                  </p>
                </div>
                <div className="hidden min-w-0 md:block">
                  <h1 className="font-heading text-2xl font-semibold tracking-tight">
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <ThemeToggle />
                  <form action={logoutAction} className="md:hidden">
                    <Button type="submit" variant="outline" size="sm" className="min-h-11">
                      Sign out
                    </Button>
                  </form>
                </div>
              </div>

              <div className="border-t border-border/50 px-4 py-2 md:hidden">
                <PlatformAdminNav orientation="horizontal" />
              </div>
            </header>

            <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
              <div className="mb-5 md:hidden">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  {title}
                </h1>
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                ) : null}
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    </PageViewTransition>
  );
}
