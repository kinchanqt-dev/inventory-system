import { ViewTransition } from "react";

import type { ReactNode } from "react";

interface PageViewTransitionProps {
  children: ReactNode;
}

/**
 * Soft page enter/exit via React 19.3 ViewTransition.
 * Activates on Transition navigations (Next.js route changes).
 *
 * Do not wrap Instant Navigation shells that stream Suspense bodies —
 * flushSync during prepare aborts the transition and warns in dev.
 */
export function PageViewTransition({
  children,
}: Readonly<PageViewTransitionProps>) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
