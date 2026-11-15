interface OrgMemberRow {
  id: string;
  userId: string;
  role: string;
  name: string;
  email: string;
}

export function OrgMembersList({
  members,
}: Readonly<{ members: OrgMemberRow[] }>) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">No members</p>;
  }

  return (
    <ul className="divide-y rounded-lg border">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        >
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-xs text-muted-foreground">
              {member.email || member.userId}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </li>
      ))}
    </ul>
  );
}
