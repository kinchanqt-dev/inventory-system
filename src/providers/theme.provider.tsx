"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

interface ThemeProviderProps {
  children: ReactNode;
}

// next-themes injects an inline <script> for FOUC prevention. React 19 warns when
// that script is created during a client render; mark the client copy as a data
// block so React ignores it. The SSR HTML script still runs before paint.
const themeScriptProps =
  typeof window === "undefined"
    ? undefined
    : ({ type: "application/json" } as const);

export function ThemeProvider({ children }: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={themeScriptProps}
    >
      <TooltipProvider delay={200}>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}
