export function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-accent,#2f5d50)_5%,var(--background)),var(--background)_28%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-360">
        <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card/40 p-4 md:block">
          <div className="mb-8 h-10 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-10 animate-pulse rounded-lg bg-muted/80"
              />
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-border/60 px-4 py-3 sm:px-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
          </div>
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
            <div className="space-y-4">
              <div className="h-10 max-w-md animate-pulse rounded-lg bg-muted" />
              <div className="h-40 animate-pulse rounded-lg bg-muted/70" />
              <div className="h-64 animate-pulse rounded-lg bg-muted/60" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export function PageBodySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 max-w-md animate-pulse rounded-lg bg-muted" />
      <div className="h-10 w-full max-w-sm animate-pulse rounded-lg bg-muted/80" />
      <div className="h-56 animate-pulse rounded-lg border border-border/50 bg-muted/50" />
    </div>
  );
}
