"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

import { Button, Label, Switch } from "@/components/ui";

interface ThemeToggleProps {
  className?: string;
  /** Icon-only control (collapsed sidebar / default toolbars). */
  compact?: boolean;
  /** Sidebar row with “Dark mode” label + switch. */
  labeled?: boolean;
}

function subscribe() {
  return () => undefined;
}

function isDarkTheme(mounted: boolean, resolvedTheme: string | undefined) {
  if (!mounted) {
    return false;
  }
  return resolvedTheme === "dark";
}

function themeAriaLabel(isDark: boolean) {
  if (isDark) {
    return "Switch to light mode";
  }
  return "Switch to dark mode";
}

function ThemeIconButton({
  className,
  isDark,
  disabled,
  onToggle,
}: Readonly<{
  className?: string;
  isDark: boolean;
  disabled: boolean;
  onToggle: () => void;
}>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("min-h-11 w-11 shrink-0 px-0", className)}
      disabled={disabled}
      aria-label={themeAriaLabel(isDark)}
      onClick={onToggle}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden />
      ) : (
        <Moon className="size-4" aria-hidden />
      )}
    </Button>
  );
}

function LabeledThemeToggle({
  className,
  isDark,
  disabled,
  onCheckedChange,
}: Readonly<{
  className?: string;
  isDark: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}>) {
  return (
    <div
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/70 px-3",
        className,
      )}
    >
      <Label
        htmlFor="theme-toggle-labeled"
        className="cursor-pointer text-sm font-normal text-foreground"
      >
        Dark mode
      </Label>
      <Switch
        id="theme-toggle-labeled"
        checked={isDark}
        disabled={disabled}
        aria-label={themeAriaLabel(isDark)}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

export function ThemeToggle({
  className,
  compact = false,
  labeled = false,
}: Readonly<ThemeToggleProps>) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = isDarkTheme(mounted, resolvedTheme);
  const disabled = !mounted;

  function setDarkMode(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  if (labeled && !compact) {
    return (
      <LabeledThemeToggle
        className={className}
        isDark={isDark}
        disabled={disabled}
        onCheckedChange={setDarkMode}
      />
    );
  }

  return (
    <ThemeIconButton
      className={className}
      isDark={isDark}
      disabled={disabled}
      onToggle={() => setDarkMode(!isDark)}
    />
  );
}
