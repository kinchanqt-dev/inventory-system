import { requirePlatformAdmin } from "@/lib/session";

import {
  lookupPlatformUserByEmail,
  PlatformAdminShell,
  UserLookupForm,
} from "@/features/platform-admin";
import { UserLookupResult } from "@/features/platform-admin/components/user-lookup-result";

export const instant = false;

interface UsersPageProps {
  searchParams: Promise<{ email?: string }>;
}

function usersPageMessage(email: string, found: boolean) {
  if (!email) {
    return "Search by email to inspect memberships and generate a recovery link.";
  }
  if (!found) {
    return "No user found for that email.";
  }
  return null;
}

function loadLookedUpUser(email: string) {
  if (!email) {
    return null;
  }
  return lookupPlatformUserByEmail(email);
}

export default async function PlatformUsersPage({
  searchParams,
}: Readonly<UsersPageProps>) {
  const user = await requirePlatformAdmin();
  const { email = "" } = await searchParams;
  const lookedUp = await loadLookedUpUser(email);
  const message = usersPageMessage(email, Boolean(lookedUp));

  return (
    <PlatformAdminShell
      title="Users"
      email={user.email ?? ""}
      description="Look up accounts, ban access, and generate recovery links."
    >
      <div className="space-y-6">
        <UserLookupForm initialEmail={email} />
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {lookedUp ? <UserLookupResult lookedUp={lookedUp} /> : null}
      </div>
    </PlatformAdminShell>
  );
}
