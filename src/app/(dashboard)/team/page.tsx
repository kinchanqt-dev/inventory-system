import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";

import { listOrganizationMembers } from "@/features/team/api/team.queries";
import { CreateStaffForm } from "@/features/team/components/create-staff-form";
import { TeamMembersList } from "@/features/team/components/team-members-list";

function TeamPageChrome() {
  return (
    <PageToolbar description="Create cashier and cook logins for your shop. No email invite needed—you set their password and share it with them." />
  );
}

async function TeamPageContent() {
  const session = await requireRole(["OWNER"]);
  const members = await listOrganizationMembers(session.organization.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <aside className="space-y-3">
        <p className="px-1 text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Invite
        </p>
        <CreateStaffForm />
      </aside>

      <section className="space-y-3">
        <div className="px-1">
          <p className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            People
          </p>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Current team
          </h2>
        </div>
        <TeamMembersList
          members={members}
          currentUserId={session.user.id}
        />
      </section>
    </div>
  );
}

export default function TeamPage() {
  return (
    <>
      <TeamPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <TeamPageContent />
      </Suspense>
    </>
  );
}
