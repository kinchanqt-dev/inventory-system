import { ThemeToggle } from "@/components/layout/theme-toggle";

import type { ReactNode } from "react";

interface AuthSurfaceProps {
  children: ReactNode;
}

export function AuthSurface({ children }: Readonly<AuthSurfaceProps>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-login-surface">
      <div
        className="auth-glow pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div
        className="login-dot-pattern pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-16 sm:px-6">
        {children}
      </main>
    </div>
  );
}
