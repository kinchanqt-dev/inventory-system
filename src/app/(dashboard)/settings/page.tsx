import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";

import { getShopBranding } from "@/features/settings";
import { SettingsForm } from "@/features/settings/components/settings-form";

export const instant = false;

export default async function SettingsPage() {
  const session = await requireRole(["OWNER"]);
  const branding = await getShopBranding();

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Settings"
      branding={branding}
    >
      <PageToolbar
        description="Change your shop name, logo, and colors."
        hint="Start with a ready-made look. Page background should stay light so text is easy to read."
      />
      <SettingsForm branding={branding} />
    </AppShell>
  );
}
