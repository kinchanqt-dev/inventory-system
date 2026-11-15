"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  ScrollText,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

interface AdminNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ADMIN_LINKS: readonly AdminNavLink[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/audit", label: "Audit", icon: ScrollText },
];

function isAdminNavLinkActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function adminNavListClass(vertical: boolean) {
  if (vertical) {
    return "flex flex-col gap-1";
  }
  return "flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";
}

function adminNavLinkClass(vertical: boolean, isActive: boolean) {
  return cn(
    "inline-flex min-h-11 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    vertical && "w-full",
    isActive
      ? "bg-primary font-medium text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

interface PlatformAdminNavLinkProps {
  link: AdminNavLink;
  pathname: string;
  vertical: boolean;
}

function PlatformAdminNavLink({
  link,
  pathname,
  vertical,
}: Readonly<PlatformAdminNavLinkProps>) {
  const isActive = isAdminNavLinkActive(pathname, link.href);
  const Icon = link.icon;

  return (
    <li className={vertical ? undefined : "shrink-0"}>
      <Link
        href={link.href}
        aria-current={isActive ? "page" : undefined}
        className={adminNavLinkClass(vertical, isActive)}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        {link.label}
      </Link>
    </li>
  );
}

interface PlatformAdminNavProps {
  orientation?: "vertical" | "horizontal";
}

export function PlatformAdminNav({
  orientation = "vertical",
}: Readonly<PlatformAdminNavProps>) {
  const pathname = usePathname();
  const vertical = orientation === "vertical";

  return (
    <nav aria-label="Admin">
      <ul className={adminNavListClass(vertical)}>
        {ADMIN_LINKS.map((link) => (
          <PlatformAdminNavLink
            key={link.href}
            link={link}
            pathname={pathname}
            vertical={vertical}
          />
        ))}
      </ul>
    </nav>
  );
}
