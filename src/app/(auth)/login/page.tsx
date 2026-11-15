import Link from "next/link";
import { Suspense } from "react";

import { PageViewTransition } from "@/components/shared/page-view-transition";

import { AuthSurface } from "@/features/auth/components/auth-surface";
import { LoginForm } from "@/features/auth";
import { DEFAULT_BRANDING } from "@/features/settings/lib/normalize-branding";
import { BrandMark } from "@/features/settings/components/brand-mark";

export const instant = false;

export default function LoginPage() {
  return (
    <PageViewTransition>
      <AuthSurface>
        <div className="animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500">
          <BrandMark
            branding={DEFAULT_BRANDING}
            size="xl"
            className="flex-col items-start gap-4"
            titleClassName="font-heading whitespace-normal"
            taglineClassName="whitespace-normal"
          />
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sign in to ring sales, track stock, and run your food shop.
          </p>
        </div>

        <section
          aria-label="Sign in"
          className="mt-10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both rounded-lg border border-border/60 bg-card/85 p-5 shadow-[0_20px_50px_-28px_rgba(31,27,24,0.35)] backdrop-blur-md duration-500 delay-150 sm:p-6"
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
          <p className="mt-4 border-t border-border/60 pt-4 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </section>
      </AuthSurface>
    </PageViewTransition>
  );
}
