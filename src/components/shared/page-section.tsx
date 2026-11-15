import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  titleId?: string;
}

export function PageSection({
  title,
  description,
  children,
  className,
  titleId,
}: Readonly<PageSectionProps>) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "rounded-lg border border-border/80 bg-card/40 p-4 sm:p-5",
        className,
      )}
    >
      <div className="mb-4 space-y-1">
        <h2
          id={titleId}
          className="text-base font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
