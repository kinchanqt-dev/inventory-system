import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";

import { getShopBranding } from "@/features/settings";
import { listOrganizationMembers } from "@/features/team/api/team.queries";
import { CreateStaffForm } from "@/features/team/components/create-staff-form";
import { TeamMembersList } from "@/features/team/components/team-members-list";

export const instant = false;

export default async function TeamPage() {
  const session = await requireRole(["OWNER"]);
  const [branding, members] = await Promise.all([
    getShopBranding(),
    listOrganizationMembers(session.organization.id),
  ]);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Team"
      branding={branding}
    >
      <PageToolbar description="Create cashier and cook logins for your shop. No email invite needed—you set their password and share it with them." />

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
    </AppShell>
  );
}
