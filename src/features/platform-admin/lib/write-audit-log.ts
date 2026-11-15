import { createAdminClient } from "@/lib/supabase/admin";

interface WriteAuditLogInput {
  actorUserId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function writePlatformAuditLog(input: WriteAuditLogInput) {
  const admin = createAdminClient();
  const { error } = await admin.from("platform_audit_logs").insert({
    actor_user_id: input.actorUserId,
    action: input.action,
    target_type: input.targetType,
    target_id: input.targetId ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    throw new Error(error.message);
  }
}
