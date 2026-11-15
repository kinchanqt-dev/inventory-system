import Link from "next/link";
import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { listProducts, ProductsTable } from "@/features/products";

function ProductsPageChrome() {
  return (
    <>
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
    </>
  );
}

async function ProductsPageContent() {
  await requireRole(["OWNER"]);
  const products = await listProducts();
  return <ProductsTable products={products} />;
}

export default function ProductsPage() {
  return (
    <>
      <ProductsPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <ProductsPageContent />
      </Suspense>
    </>
  );
}
