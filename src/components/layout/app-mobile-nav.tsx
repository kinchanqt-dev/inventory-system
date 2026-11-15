"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { AppMobileMoreButton } from "@/components/layout/app-mobile-more-button";
import { AppMobileMoreSheet } from "@/components/layout/app-mobile-more-sheet";
import { AppMobileNavLink } from "@/components/layout/app-mobile-nav-link";
import {
  isNavLinkActive,
  navLinksBySection,
  primaryMobileNavLinks,
  secondaryMobileNavLinks,
} from "@/components/layout/nav-links";

import type { NavLink } from "@/components/layout/nav-links";
import type { RoleValue } from "@/enums";

interface AppMobileNavProps {
  role: RoleValue;
}

function secondaryHrefSet(secondaryLinks: NavLink[]) {
  return new Set(secondaryLinks.map((link) => link.href));
}

function moreNavGroups(role: RoleValue, secondaryLinks: NavLink[]) {
  const secondaryHrefs = secondaryHrefSet(secondaryLinks);
  return navLinksBySection(role)
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => secondaryHrefs.has(link.href)),
    }))
    .filter((group) => group.links.length > 0);
}

function isMoreActive(pathname: string, secondaryLinks: NavLink[]) {
  return secondaryLinks.some((link) => isNavLinkActive(pathname, link.href));
}

function hasNoNavLinks(primaryLinks: NavLink[], secondaryLinks: NavLink[]) {
  return primaryLinks.length === 0 && secondaryLinks.length === 0;
}

function MoreNavSlot({
  secondaryLinks,
  pathname,
  moreOpen,
  onOpen,
}: Readonly<{
  secondaryLinks: NavLink[];
  pathname: string;
  moreOpen: boolean;
  onOpen: () => void;
}>) {
  if (secondaryLinks.length === 0) {
    return null;
  }

  return (
    <li className="min-w-0">
      <AppMobileMoreButton
        isActive={isMoreActive(pathname, secondaryLinks)}
        isOpen={moreOpen}
        onOpen={onOpen}
      />
    </li>
  );
}

export function AppMobileNav({ role }: Readonly<AppMobileNavProps>) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryLinks = primaryMobileNavLinks(role);
  const secondaryLinks = secondaryMobileNavLinks(role);

  if (hasNoNavLinks(primaryLinks, secondaryLinks)) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-safe backdrop-blur md:hidden"
      >
        <ul className="grid auto-cols-fr grid-flow-col">
          {primaryLinks.map((link) => (
            <li key={link.href} className="min-w-0">
              <AppMobileNavLink
                href={link.href}
                label={link.label}
                shortLabel={link.shortLabel}
                icon={link.icon}
                isActive={isNavLinkActive(pathname, link.href)}
              />
            </li>
          ))}
          <MoreNavSlot
            secondaryLinks={secondaryLinks}
            pathname={pathname}
            moreOpen={moreOpen}
            onOpen={() => setMoreOpen(true)}
          />
        </ul>
      </nav>

      <AppMobileMoreSheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        pathname={pathname}
        groups={moreNavGroups(role, secondaryLinks)}
      />
    </>
  );
}
