import Link from "next/link";
import { format } from "date-fns";

import { requirePlatformAdmin } from "@/lib/session";

import { PageSection } from "@/components/shared";
import { Button } from "@/components/ui";

import {
  getPlatformDashboardStats,
  PlatformAdminShell,
} from "@/features/platform-admin";

export const instant = false;

export default async function PlatformAdminPage() {
  const user = await requirePlatformAdmin();
  const stats = await getPlatformDashboardStats();

  return (
    <PlatformAdminShell
      title="Overview"
      email={user.email ?? ""}
      description="Platform health across shops, suspensions, and profiles."
    >
      <div className="space-y-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/70 bg-card/80 px-4 py-5 shadow-sm">
            <p className="font-heading text-3xl font-semibold tabular-nums tracking-tight">
              {stats.orgCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Organizations</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/80 px-4 py-5 shadow-sm">
            <p className="font-heading text-3xl font-semibold tabular-nums tracking-tight">
              {stats.suspendedCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Suspended</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-card/80 px-4 py-5 shadow-sm">
            <p className="font-heading text-3xl font-semibold tabular-nums tracking-tight">
              {stats.userCount}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Profiles</p>
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href="/admin/organizations" />} className="min-h-11">
            Browse organizations
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/admin/users" />}
            className="min-h-11"
          >
            Look up a user
          </Button>
        </div>

        <PageSection title="Recent audit" description="Latest platform actions">
          {stats.recentAudit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit events yet</p>
          ) : (
            <ul className="divide-y divide-border/70">
              {stats.recentAudit.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.target_type}
                      {entry.target_id ? ` · ${entry.target_id}` : ""}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground tabular-nums">
                    {format(new Date(entry.created_at), "MMM d, HH:mm")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </PageSection>
      </div>
    </PlatformAdminShell>
  );
}
