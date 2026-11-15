import { Button } from "@/components/ui";

import {
  enterOrganizationSupportAction,
  setOrganizationStatusAction,
} from "@/features/platform-admin/api/platform-admin.actions";

import type { OrganizationStatus } from "@/types/database.types";

interface OrgDetailActionsProps {
  organizationId: string;
  status: OrganizationStatus;
}

export function OrgDetailActions({
  organizationId,
  status,
}: Readonly<OrgDetailActionsProps>) {
  const nextStatus = status === "active" ? "suspended" : "active";

  return (
    <div className="flex flex-wrap gap-2">
      <form action={enterOrganizationSupportAction.bind(null, organizationId)}>
        <Button type="submit" className="min-h-11">
          Enter as support
        </Button>
      </form>
      <form
        action={setOrganizationStatusAction.bind(
          null,
          organizationId,
          nextStatus,
        )}
      >
        <Button type="submit" variant="outline" className="min-h-11">
          {status === "active" ? "Suspend organization" : "Reactivate"}
        </Button>
      </form>
    </div>
  );
}
