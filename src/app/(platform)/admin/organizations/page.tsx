import Link from "next/link";
import { format } from "date-fns";
import { Search } from "lucide-react";

import { requirePlatformAdmin } from "@/lib/session";

import { Button } from "@/components/ui";

import {
  listPlatformOrganizations,
  OrgStatusBadge,
  PlatformAdminShell,
} from "@/features/platform-admin";

export const instant = false;

interface OrganizationsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PlatformOrganizationsPage({
  searchParams,
}: Readonly<OrganizationsPageProps>) {
  const user = await requirePlatformAdmin();
  const { q = "" } = await searchParams;
  const organizations = await listPlatformOrganizations(q);

  return (
    <PlatformAdminShell
      title="Organizations"
      email={user.email ?? ""}
      description="Browse shops, check status, and open support mode."
    >
      <div className="space-y-4">
        <form className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name or slug"
              className="min-h-11 w-full rounded-xl border border-border/70 bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search organizations"
            />
          </div>
          <Button type="submit" className="min-h-11 sm:px-5">
            Search
          </Button>
        </form>

        {organizations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-14 text-center">
            <p className="font-medium">No organizations found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search, or wait for a shop to finish onboarding.
            </p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm">
            {organizations.map((org) => (
              <li
                key={org.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:px-5"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/organizations/${org.id}`}
                    className="font-medium hover:underline"
                  >
                    {org.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {org.slug} · {org.memberCount} members ·{" "}
                    {format(new Date(org.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <OrgStatusBadge status={org.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PlatformAdminShell>
  );
}
