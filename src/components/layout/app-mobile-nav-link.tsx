"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

interface AppMobileNavLinkProps {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  isActive: boolean;
}

function mobileNavLinkClass(isActive: boolean) {
  if (isActive) {
    return "font-medium text-primary";
  }
  return "text-muted-foreground hover:text-foreground";
}

function MobileNavActiveMark({ isActive }: Readonly<{ isActive: boolean }>) {
  if (!isActive) {
    return null;
  }
  return (
    <span
      className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
      aria-hidden
    />
  );
}

function mobileNavIconClass(isActive: boolean) {
  if (isActive) {
    return "size-5 shrink-0 text-primary";
  }
  return "size-5 shrink-0";
}

function pageAriaCurrent(isActive: boolean) {
  if (isActive) {
    return "page" as const;
  }
  return undefined;
}

export function AppMobileNavLink({
  href,
  label,
  shortLabel,
  icon: Icon,
  isActive,
}: Readonly<AppMobileNavLinkProps>) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={pageAriaCurrent(isActive)}
      className={cn(
        "relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-nav-xs tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        mobileNavLinkClass(isActive),
      )}
    >
      <MobileNavActiveMark isActive={isActive} />
      <Icon className={mobileNavIconClass(isActive)} aria-hidden />
      <span className="max-w-full truncate">{shortLabel}</span>
    </Link>
  );
}
