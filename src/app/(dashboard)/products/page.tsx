import Link from "next/link";

import { requireRole } from "@/lib/session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { listProducts, ProductsTable } from "@/features/products";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function ProductsPage() {
  const session = await requireRole(["OWNER"]);
  const [products, branding] = await Promise.all([
    listProducts(),
    getShopBranding(),
  ]);

  return (
    <AppShell
      name={session.user.name ?? "Owner"}
      role={session.user.role}
      title="Products"
      branding={branding}
    >
      <PageBreadcrumb items={[{ label: "Products" }]} />
      <PageToolbar
        description="Add and manage the food items you sell. Photos are optional and make items easier to spot."
        hint="Each item needs its own item code. Product code is optional."
        actions={
          <Button
            className="min-h-11 w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/products/new" />}
          >
            Add product
          </Button>
        }
      />
      <ProductsTable products={products} />
    </AppShell>
  );
}
