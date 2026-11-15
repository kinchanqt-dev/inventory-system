import { Badge } from "@/components/ui/badge";

import type { StockStatus } from "@/lib/stock-status";

export function StockStatusBadge({ status }: Readonly<{ status: StockStatus }>) {
  if (status === "out") {
    return <Badge variant="destructive">Out</Badge>;
  }

  if (status === "low") {
    return <Badge variant="destructive">Low</Badge>;
  }

  return <Badge variant="secondary">OK</Badge>;
}