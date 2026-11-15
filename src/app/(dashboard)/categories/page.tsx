import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listCategories } from "@/features/categories/api/category.queries";
import { CategoriesManager } from "@/features/categories/components/categories-manager";

function CategoriesPageChrome() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Categories" }]} />
      <PageToolbar description="Organize menu products and purchased ingredients your way. Seeded recommendations are editable—add, rename, or delete freely." />
    </>
  );
}

async function CategoriesPageContent() {
  await requireRole(["OWNER"]);
  const categories = await listCategories();
  return <CategoriesManager categories={categories} />;
}

export default function CategoriesPage() {
  return (
    <>
      <CategoriesPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <CategoriesPageContent />
      </Suspense>
    </>
  );
}
