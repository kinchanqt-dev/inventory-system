import { notFound } from "next/navigation";

import { requireRole } from "@/lib/session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import {
  getProductById,
  listCategories,
  ProductForm,
} from "@/features/products";
import { toProductFormValues } from "@/features/products/lib/to-product-form-values";
import { getShopBranding } from "@/features/settings";

export const instant = false;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: Readonly<EditProductPageProps>) {
  const session = await requireRole(["OWNER"]);
  const { id } = await params;
  const [product, categories, branding] = await Promise.all([
    getProductById(id),
    listCategories(),
    getShopBranding(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AppShell
      name={session.user.name ?? "Owner"}
      role={session.user.role}
      title={`Edit ${product.name}`}
      branding={branding}
    >
      <PageBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: `Edit ${product.name}` },
        ]}
      />
      <PageToolbar
        description="Change the item’s name, price, photo, and low stock alert."
        hint="To add or remove stock, use the Inventory page."
      />
      <ProductForm
        categories={categories}
        product={toProductFormValues(product)}
      />
    </AppShell>
  );
}
