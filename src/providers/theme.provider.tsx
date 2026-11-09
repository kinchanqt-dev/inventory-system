"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delay={200}>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}
