import { redirect } from "next/navigation";
import { connection } from "next/server";

import {
  emailIsPlatformAdminAllowlisted,
  isPlatformAdminUser,
} from "@/lib/platform-admin";
import {
  ensurePlatformAdminMetadata,
  listUserOrganizations,
  requireAuthUser,
  setActiveOrganizationId,
} from "@/lib/session";

import { PageViewTransition } from "@/components/shared/page-view-transition";

import { AuthSurface } from "@/features/auth/components/auth-surface";
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form";
import { DEFAULT_BRANDING } from "@/features/settings/lib/normalize-branding";
import { BrandMark } from "@/features/settings/components/brand-mark";

export const instant = false;

export default async function OnboardingPage() {
  await connection();
  const authUser = await requireAuthUser();
  const user = await ensurePlatformAdminMetadata(authUser);

  if (
    isPlatformAdminUser(user) ||
    emailIsPlatformAdminAllowlisted(user.email)
  ) {
    redirect("/admin");
  }

  const memberships = await listUserOrganizations(user.id);

  if (memberships[0]) {
    await setActiveOrganizationId(memberships[0].organization.id);
    redirect("/");
  }

  return (
    <PageViewTransition>
      <AuthSurface>
        <BrandMark
          branding={DEFAULT_BRANDING}
          size="lg"
          className="flex-col items-start gap-3"
          titleClassName="font-heading"
        />
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">
          Set up your business
        </h1>
        <p className="mt-2 text-muted-foreground">
          This creates your private food shop workspace. Other businesses cannot
          see your inventory or sales.
        </p>
        <section className="mt-8 rounded-lg border border-border/60 bg-card/85 p-5 shadow-[0_20px_50px_-28px_rgba(31,27,24,0.35)] backdrop-blur-md sm:p-6">
          <CreateOrganizationForm />
        </section>
      </AuthSurface>
    </PageViewTransition>
  );
}
