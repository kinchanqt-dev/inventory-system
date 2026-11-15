import { format } from "date-fns";

import { requirePlatformAdmin } from "@/lib/session";

import {
  listPlatformAuditLogs,
  PlatformAdminShell,
} from "@/features/platform-admin";

export const instant = false;

export default async function PlatformAuditPage() {
  const user = await requirePlatformAdmin();
  const entries = await listPlatformAuditLogs(100);

  return (
    <PlatformAdminShell
      title="Audit log"
      email={user.email ?? ""}
      description="Recent platform actions across organizations and users."
    >
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No audit events yet</p>
      ) : (
        <ul className="divide-y rounded-xl border">
          {entries.map((entry) => (
            <li key={entry.id} className="space-y-1 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{entry.action}</p>
                <time className="text-xs text-muted-foreground tabular-nums">
                  {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
                </time>
              </div>
              <p className="text-xs text-muted-foreground">
                {entry.target_type}
                {entry.target_id ? ` · ${entry.target_id}` : ""} · actor{" "}
                {entry.actor_user_id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PlatformAdminShell>
  );
}
