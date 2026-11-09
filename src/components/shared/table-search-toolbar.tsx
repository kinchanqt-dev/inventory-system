import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

interface TableSearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "aria-label": string;
  matchedCount: number;
  totalCount: number;
  actions?: ReactNode;
}

export function TableSearchToolbar({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  matchedCount,
  totalCount,
  actions,
}: Readonly<TableSearchToolbarProps>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="min-h-11 sm:max-w-sm"
        />
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground tabular-nums">
        {matchedCount} of {totalCount}
      </p>
    </div>
  );
}
