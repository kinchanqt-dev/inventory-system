import Link from "next/link";

import { Badge, Button } from "@/components/ui";

import { setUserBannedAction } from "@/features/platform-admin/api/platform-admin.actions";
import { OrgStatusBadge } from "@/features/platform-admin/components/org-status-badge";
import { RecoveryLinkPanel } from "@/features/platform-admin/components/recovery-link-panel";

import type { PlatformUserLookup } from "@/features/platform-admin/api/platform-admin.queries";

export function UserLookupResult({
  lookedUp,
}: Readonly<{ lookedUp: PlatformUserLookup }>) {
  const isBanned = Boolean(lookedUp.bannedUntil);

  return (
    <div className="space-y-5 rounded-xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{lookedUp.name}</p>
          <p className="text-sm text-muted-foreground">{lookedUp.email}</p>
        </div>
        {isBanned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        )}
      </div>

      <form action={setUserBannedAction.bind(null, lookedUp.id, !isBanned)}>
        <Button type="submit" variant="outline" className="min-h-11">
          {isBanned ? "Unban user" : "Ban user"}
        </Button>
      </form>

      <RecoveryLinkPanel userId={lookedUp.id} />

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Organizations</h2>
        {lookedUp.organizations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No memberships</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {lookedUp.organizations.map((org) => (
              <li
                key={org.id}
                className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
              >
                <div>
                  <Link
                    href={`/admin/organizations/${org.id}`}
                    className="font-medium hover:underline"
                  >
                    {org.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {org.slug} · {org.role}
                  </p>
                </div>
                <OrgStatusBadge status={org.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
