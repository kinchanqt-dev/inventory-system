import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DataListCardProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function DataListCard({
  children,
  footer,
  className,
}: Readonly<DataListCardProps>) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border/80 bg-card p-4 text-card-foreground",
        className,
      )}
    >
      <div className="space-y-3">{children}</div>
      {footer ? (
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t pt-3">
          {footer}
        </div>
      ) : null}
    </article>
  );
}
