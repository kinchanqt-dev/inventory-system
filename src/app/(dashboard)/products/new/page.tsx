import { requireRole } from "@/lib/session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listCategories, ProductForm } from "@/features/products";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function NewProductPage() {
  const session = await requireRole(["OWNER"]);
  const [categories, branding] = await Promise.all([
    listCategories(),
    getShopBranding(),
  ]);

  return (
    <AppShell
      name={session.user.name ?? "Owner"}
      role={session.user.role}
      title="Add product"
      branding={branding}
    >
      <PageBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: "Add product" },
        ]}
      />
      <PageToolbar
        description="Add a new item with price, optional photo, and starting stock."
        hint="Pick a clear item code so staff can find it quickly at the counter."
      />
      <ProductForm categories={categories} />
    </AppShell>
  );
}
