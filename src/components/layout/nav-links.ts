import {
  Carrot,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Soup,
  Tags,
  Users,
} from "lucide-react";

import type { RoleValue } from "@/enums";
import type { LucideIcon } from "lucide-react";

export type NavSection = "operate" | "catalog" | "shop";

export interface NavLink {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  roles: RoleValue[];
  section: NavSection;
}

const NAV_SECTION_LABELS: Record<NavSection, string> = {
  operate: "Operate",
  catalog: "Catalog",
  shop: "Shop",
};

const NAV_SECTION_ORDER: NavSection[] = ["operate", "catalog", "shop"];

const NAV_LINKS: NavLink[] = [
  {
    href: "/",
    label: "Dashboard",
    shortLabel: "Home",
    icon: LayoutDashboard,
    roles: ["OWNER", "CASHIER"],
    section: "operate",
  },
  {
    href: "/pos",
    label: "POS",
    shortLabel: "POS",
    icon: ShoppingCart,
    roles: ["OWNER", "CASHIER"],
    section: "operate",
  },
  {
    href: "/kitchen",
    label: "Kitchen",
    shortLabel: "Kitchen",
    icon: ChefHat,
    roles: ["OWNER", "CASHIER", "COOK"],
    section: "operate",
  },
  {
    href: "/sales",
    label: "Sales",
    shortLabel: "Sales",
    icon: ClipboardList,
    roles: ["OWNER", "CASHIER"],
    section: "operate",
  },
  {
    href: "/products",
    label: "Products",
    shortLabel: "Items",
    icon: Package,
    roles: ["OWNER"],
    section: "catalog",
  },
  {
    href: "/categories",
    label: "Categories",
    shortLabel: "Cats",
    icon: Tags,
    roles: ["OWNER"],
    section: "catalog",
  },
  {
    href: "/ingredients",
    label: "Ingredients",
    shortLabel: "Ingr.",
    icon: Carrot,
    roles: ["OWNER"],
    section: "catalog",
  },
  {
    href: "/sub-recipes",
    label: "Sub-recipes",
    shortLabel: "Prep",
    icon: Soup,
    roles: ["OWNER"],
    section: "catalog",
  },
  {
    href: "/team",
    label: "Team",
    shortLabel: "Team",
    icon: Users,
    roles: ["OWNER"],
    section: "shop",
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Setup",
    icon: Settings,
    roles: ["OWNER"],
    section: "shop",
  },
];

const PRIMARY_MOBILE_HREFS = new Set(["/", "/pos", "/kitchen", "/sales"]);

export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function navLinksForRole(role: RoleValue) {
  return NAV_LINKS.filter((link) => link.roles.includes(role));
}

export function primaryMobileNavLinks(role: RoleValue) {
  return navLinksForRole(role).filter((link) =>
    PRIMARY_MOBILE_HREFS.has(link.href),
  );
}

export function secondaryMobileNavLinks(role: RoleValue) {
  return navLinksForRole(role).filter(
    (link) => !PRIMARY_MOBILE_HREFS.has(link.href),
  );
}

export function navLinksBySection(role: RoleValue) {
  const links = navLinksForRole(role);
  return NAV_SECTION_ORDER.map((section) => ({
    section,
    label: NAV_SECTION_LABELS[section],
    links: links.filter((link) => link.section === section),
  })).filter((group) => group.links.length > 0);
}
