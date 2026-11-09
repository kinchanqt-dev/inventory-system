"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import {
  isNavLinkActive,
  NAV_LINKS,
} from "@/components/layout/nav-links";

import type { RoleValue } from "@/enums";

interface AppMobileNavProps {
  role: RoleValue;
}

export function AppMobileNav({ role }: Readonly<AppMobileNavProps>) {
  const pathname = usePathname();
  const links = NAV_LINKS.filter((link) => link.roles.includes(role));

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-safe backdrop-blur md:hidden"
    >
      <ul className="grid auto-cols-fr grid-flow-col">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <li key={link.href} className="min-w-0">
              <Link
                href={link.href}
                aria-label={link.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-nav-xs tracking-tight transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive ? (
                  <span
                    className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
                    aria-hidden
                  />
                ) : null}
                <Icon
                  className={cn("size-5 shrink-0", isActive && "text-primary")}
                  aria-hidden
                />
                <span className="max-w-full truncate">{link.shortLabel}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
