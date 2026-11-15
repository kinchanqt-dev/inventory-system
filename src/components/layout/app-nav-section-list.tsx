"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { isNavLinkActive } from "@/components/layout/nav-links";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";

import type { NavLink, NavSection } from "@/components/layout/nav-links";

export interface AppNavSectionGroup {
  section: NavSection;
  label: string;
  links: NavLink[];
}

interface AppNavSectionListProps {
  groups: AppNavSectionGroup[];
  pathname: string;
  linkClassName: (isActive: boolean) => string;
  onNavigate?: () => void;
  className?: string;
  collapsed?: boolean;
}

function NavLinkItem({
  link,
  pathname,
  linkClassName,
  onNavigate,
  collapsed,
}: Readonly<{
  link: NavLink;
  pathname: string;
  linkClassName: (isActive: boolean) => string;
  onNavigate?: () => void;
  collapsed: boolean;
}>) {
  const Icon = link.icon;
  const isActive = isNavLinkActive(pathname, link.href);

  if (!collapsed) {
    return (
      <li>
        <Link
          href={link.href}
          aria-current={isActive ? "page" : undefined}
          className={linkClassName(isActive)}
          onClick={onNavigate}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {link.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={link.label}
              className={linkClassName(isActive)}
              onClick={onNavigate}
            />
          }
        >
          <Icon className="size-4 shrink-0" aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="right">{link.label}</TooltipContent>
      </Tooltip>
    </li>
  );
}

export function AppNavSectionList({
  groups,
  pathname,
  linkClassName,
  onNavigate,
  className,
  collapsed = false,
}: Readonly<AppNavSectionListProps>) {
  return (
    <div className={className}>
      {groups.map((group) => (
        <div key={group.section} className="space-y-1.5">
          {collapsed ? null : (
            <p className="px-3 text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {group.label}
            </p>
          )}
          <ul className={cn("flex flex-col gap-1", collapsed && "items-stretch")}>
            {group.links.map((link) => (
              <NavLinkItem
                key={link.href}
                link={link}
                pathname={pathname}
                linkClassName={linkClassName}
                onNavigate={onNavigate}
                collapsed={collapsed}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
