import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Warehouse,
} from "lucide-react";

import type { RoleValue } from "@/enums";

export const NAV_LINKS: {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
  roles: RoleValue[];
}[] = [
  {
    href: "/",
    label: "Dashboard",
    shortLabel: "Home",
    icon: LayoutDashboard,
    roles: ["OWNER", "CASHIER"],
  },
  {
    href: "/pos",
    label: "POS",
    shortLabel: "POS",
    icon: ShoppingCart,
    roles: ["OWNER", "CASHIER"],
  },
  {
    href: "/products",
    label: "Products",
    shortLabel: "Items",
    icon: Package,
    roles: ["OWNER"],
  },
  {
    href: "/inventory",
    label: "Inventory",
    shortLabel: "Stock",
    icon: Warehouse,
    roles: ["OWNER"],
  },
  {
    href: "/sales",
    label: "Sales",
    shortLabel: "Sales",
    icon: ClipboardList,
    roles: ["OWNER", "CASHIER"],
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Setup",
    icon: Settings,
    roles: ["OWNER"],
  },
];

export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}
