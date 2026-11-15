import type { AppSession } from "@/lib/session";

export function appShellSessionProps(session: AppSession) {
  return {
    name: session.user.name,
    role: session.user.role,
    isPlatformAdmin: session.isPlatformAdmin,
    isSupportMode: session.isSupportMode,
    supportOrganizationName: session.isSupportMode
      ? session.organization.name
      : undefined,
  };
}
