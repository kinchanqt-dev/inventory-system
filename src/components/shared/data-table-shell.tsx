import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui";

interface DataTableColumn {
  label: string;
  align?: "left" | "right";
}

interface DataTableShellProps {
  columns: DataTableColumn[];
  children: ReactNode;
}

export function DataTableShell({
  columns,
  children,
}: Readonly<DataTableShellProps>) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/40 backdrop-blur supports-backdrop-filter:bg-muted/30">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={cn(
                  "text-xs tracking-wide text-muted-foreground uppercase",
                  column.align === "right" && "text-right",
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
