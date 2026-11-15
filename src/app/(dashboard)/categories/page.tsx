import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listCategories } from "@/features/categories/api/category.queries";
import { CategoriesManager } from "@/features/categories/components/categories-manager";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function CategoriesPage() {
  const session = await requireRole(["OWNER"]);
  const [branding, categories] = await Promise.all([
    getShopBranding(),
    listCategories(),
  ]);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Categories"
      branding={branding}
    >
      <PageBreadcrumb items={[{ label: "Categories" }]} />
      <PageToolbar description="Organize menu products and purchased ingredients your way. Seeded recommendations are editable—add, rename, or delete freely." />
      <CategoriesManager categories={categories} />
    </AppShell>
  );
}
