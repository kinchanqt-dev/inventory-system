import { Suspense } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";

import { LoginForm } from "@/features/auth";
import { getShopBranding } from "@/features/settings";
import { BrandMark } from "@/features/settings/components/brand-mark";

export const instant = false;

export default async function LoginPage() {
  const branding = await getShopBranding();
  const showSeedHint = process.env.NODE_ENV === "development";

  return (
    <div className="relative min-h-screen overflow-hidden bg-login-surface">
      <div
        className="login-dot-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-16 sm:px-6">
        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500">
          <BrandMark
            branding={branding}
            size="xl"
            className="flex-col items-start gap-4"
            titleClassName="whitespace-normal"
            taglineClassName="whitespace-normal"
          />
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sign in to manage stock and sales for {branding.shopTitle}.
          </p>
        </div>

        <section
          aria-label="Sign in"
          className="mt-10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-2xl border border-border/70 bg-card/90 p-5 shadow-sm backdrop-blur-sm duration-500 delay-150 sm:p-6"
        >
          <Suspense
            fallback={
              <p className="text-sm text-muted-foreground">
                Loading sign-in form…
              </p>
            }
          >
            <LoginForm />
          </Suspense>
          {showSeedHint ? (
            <p className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
              Dev only — owner@local.dev / cashier@local.dev · password123
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
