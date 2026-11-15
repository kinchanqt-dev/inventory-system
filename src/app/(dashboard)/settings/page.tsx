import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";

import { getShopBranding } from "@/features/settings";
import { SettingsForm } from "@/features/settings/components/settings-form";

function SettingsPageChrome() {
  return (
    <PageToolbar
      description="Change your shop name, logo, and colors."
      hint="Start with a ready-made look. Page background should stay light so text is easy to read."
    />
  );
}

async function SettingsPageContent() {
  await requireRole(["OWNER"]);
  const branding = await getShopBranding();
  return <SettingsForm branding={branding} />;
}

export default function SettingsPage() {
  return (
    <>
      <SettingsPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <SettingsPageContent />
      </Suspense>
    </>
  );
}
