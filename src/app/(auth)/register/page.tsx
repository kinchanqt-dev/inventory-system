import Link from "next/link";

import { PageViewTransition } from "@/components/shared/page-view-transition";

import { AuthSurface } from "@/features/auth/components/auth-surface";
import { RegisterForm } from "@/features/auth/components/register-form";
import { DEFAULT_BRANDING } from "@/features/settings/lib/normalize-branding";
import { BrandMark } from "@/features/settings/components/brand-mark";

export const instant = false;

export default function RegisterPage() {
  return (
    <PageViewTransition>
      <AuthSurface>
        <BrandMark
          branding={DEFAULT_BRANDING}
          size="xl"
          className="flex-col items-start gap-4"
          titleClassName="font-heading whitespace-normal"
        />
        <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
          Create your account, then set up your food business workspace.
        </p>

        <section
          aria-label="Create account"
          className="mt-10 rounded-2xl border border-border/60 bg-card/85 p-5 shadow-[0_20px_50px_-28px_rgba(31,27,24,0.35)] backdrop-blur-md sm:p-6"
        >
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Back to sign in
            </Link>
          </p>
        </section>
      </AuthSurface>
    </PageViewTransition>
  );
}
