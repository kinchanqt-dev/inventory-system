"use client";

import { ROLE_LABELS } from "@/enums";

import { Badge, Button } from "@/components/ui";

import type { TeamMember } from "@/features/team/types/team.types";

interface TeamMemberRowProps {
  member: TeamMember;
  canRemove: boolean;
  isPending: boolean;
  onRemove: (userId: string, name: string) => void;
}

function roleBadgeVariant(role: TeamMember["role"]) {
  if (role === "OWNER") {
    return "default" as const;
  }
  return "secondary" as const;
}

export function TeamMemberRow({
  member,
  canRemove,
  isPending,
  onRemove,
}: Readonly<TeamMemberRowProps>) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:px-5">
      <div className="min-w-0">
        <p className="font-medium">{member.name}</p>
        <p className="text-xs text-muted-foreground">
          {member.email ?? "No email on file"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={roleBadgeVariant(member.role)}>
          {ROLE_LABELS[member.role]}
        </Badge>
        {canRemove ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={isPending}
            onClick={() => onRemove(member.userId, member.name)}
          >
            Remove
          </Button>
        ) : null}
      </div>
    </li>
  );
}
