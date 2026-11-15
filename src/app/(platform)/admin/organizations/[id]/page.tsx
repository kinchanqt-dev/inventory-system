import { notFound } from "next/navigation";
import { format } from "date-fns";

import { requirePlatformAdmin } from "@/lib/session";

import { PageBreadcrumb } from "@/components/shared";

import {
  getPlatformOrganization,
  OrgStatusBadge,
  PlatformAdminShell,
} from "@/features/platform-admin";
import { OrgDetailActions } from "@/features/platform-admin/components/org-detail-actions";
import { OrgMembersList } from "@/features/platform-admin/components/org-members-list";

export const instant = false;

interface OrganizationDetailPageProps {
  params: Promise<{ id: string }>;
}

function organizationStatus(
  status: "active" | "suspended" | undefined,
): "active" | "suspended" {
  if (status === "suspended") {
    return "suspended";
  }
  return "active";
}

export default async function PlatformOrganizationDetailPage({
  params,
}: Readonly<OrganizationDetailPageProps>) {
  const user = await requirePlatformAdmin();
  const { id } = await params;
  const detail = await getPlatformOrganization(id);

  if (!detail) {
    notFound();
  }

  const status = organizationStatus(detail.organization.status);

  return (
    <PlatformAdminShell
      title={detail.organization.name}
      email={user.email ?? ""}
      description="Organization detail, members, and support actions."
    >
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Organizations", href: "/admin/organizations" },
            { label: detail.organization.name },
          ]}
        />

        <div className="flex flex-wrap items-center gap-3">
          <OrgStatusBadge status={status} />
          <p className="text-sm text-muted-foreground">
            {detail.organization.slug} · {detail.salesCount} sales · created{" "}
            {format(new Date(detail.organization.created_at), "MMM d, yyyy")}
          </p>
        </div>

        <OrgDetailActions
          organizationId={detail.organization.id}
          status={status}
        />

        <section className="space-y-3">
          <h2 className="text-base font-semibold">Members</h2>
          <OrgMembersList members={detail.members} />
        </section>
      </div>
    </PlatformAdminShell>
  );
}
