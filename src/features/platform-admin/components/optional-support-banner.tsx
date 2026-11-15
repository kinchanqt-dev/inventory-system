import { SupportModeBanner } from "@/features/platform-admin/components/support-mode-banner";

interface OptionalSupportBannerProps {
  isSupportMode: boolean;
  organizationName: string;
}

export function OptionalSupportBanner({
  isSupportMode,
  organizationName,
}: Readonly<OptionalSupportBannerProps>) {
  if (!isSupportMode) {
    return null;
  }
  return <SupportModeBanner organizationName={organizationName} />;
}
