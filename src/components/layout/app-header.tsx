"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/enums";

import {
  isNavLinkActive,
  NAV_LINKS,
} from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui";

import { logoutAction } from "@/features/auth/api/login.actions";
import { BrandMark } from "@/features/settings/components/brand-mark";

import type { RoleValue } from "@/enums";
import type { ShopBranding } from "@/features/settings";

interface AppHeaderProps {
  name: string;
  role: RoleValue;
  title: string;
  branding: ShopBranding;
}

export function AppHeader({
  name,
  role,
  title,
  branding,
}: Readonly<AppHeaderProps>) {
  const pathname = usePathname();
  const links = NAV_LINKS.filter((link) => link.roles.includes(role));

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-center justify-between gap-3">
          <BrandMark branding={branding} size="sm" />
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="min-h-11 min-w-11"
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex flex-wrap items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = isNavLinkActive(pathname, link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isActive
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 border-t pt-3">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            <span className="sm:hidden">{name}</span>
            <span className="hidden sm:inline">
              Signed in as {name} ({ROLE_LABELS[role]})
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
