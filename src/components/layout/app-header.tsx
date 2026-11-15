"use client";

import Link from "next/link";

import { ROLE_LABELS } from "@/enums";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { BrandMark } from "@/features/settings/components/brand-mark";

import type { RoleValue } from "@/enums";
import type { ShopBranding } from "@/features/settings";

interface AppHeaderProps {
  name: string;
  role: RoleValue;
  title: React.ReactNode;
  branding: ShopBranding;
  isPlatformAdmin?: boolean;
}

export function AppHeader({
  name,
  role,
  title,
  branding,
  isPlatformAdmin = false,
}: Readonly<AppHeaderProps>) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 md:hidden">
          <BrandMark branding={branding} size="sm" />
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {name} · {ROLE_LABELS[role]}
          </p>
        </div>

        <div className="hidden min-w-0 md:block">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          {isPlatformAdmin ? (
            <Button
              nativeButton={false}
              variant="ghost"
              size="sm"
              className="min-h-11"
              render={<Link href="/admin" />}
            >
              Admin
            </Button>
          ) : null}
          <ThemeToggle />
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="min-h-11"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
