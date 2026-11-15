"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { removeStaffAction } from "@/features/team/api/team.actions";
import { TeamMemberRow } from "@/features/team/components/team-member-row";

import type { TeamMember } from "@/features/team/types/team.types";

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserId: string;
}

function canRemoveMember(member: TeamMember, currentUserId: string) {
  if (member.role === "OWNER") {
    return false;
  }
  return member.userId !== currentUserId;
}

export function TeamMembersList({
  members,
  currentUserId,
}: Readonly<TeamMembersListProps>) {
  const [isPending, startTransition] = useTransition();

  function handleRemove(userId: string, name: string) {
    startTransition(async () => {
      const result = await removeStaffAction(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`${name} removed from the team`);
    });
  }

  if (members.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
        No team members yet
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[0_18px_40px_-28px_rgba(26,42,36,0.28)]">
      {members.map((member) => (
        <TeamMemberRow
          key={member.userId}
          member={member}
          canRemove={canRemoveMember(member, currentUserId)}
          isPending={isPending}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  );
}
