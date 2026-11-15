import { Badge } from "@/components/ui";

import type { OrganizationStatus } from "@/types/database.types";

export function OrgStatusBadge({
  status,
}: Readonly<{ status: OrganizationStatus }>) {
  if (status === "suspended") {
    return <Badge variant="destructive">Suspended</Badge>;
  }
  return <Badge variant="secondary">Active</Badge>;
}
