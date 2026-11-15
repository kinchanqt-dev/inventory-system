import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import {
  IngredientForm,
  listIngredientCategories,
} from "@/features/ingredients";

function NewIngredientPageChrome() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Ingredients", href: "/ingredients" },
          { label: "Add ingredient" },
        ]}
      />
      <PageToolbar
        description="Set pack price, size, yield, and starting stock for a purchased item."
        hint="Yield is edible portion after prep — lower yield raises true cost per unit."
      />
    </>
  );
}

async function NewIngredientPageContent() {
  await requireRole(["OWNER"]);
  const categories = await listIngredientCategories();
  return <IngredientForm categories={categories} />;
}

export default function NewIngredientPage() {
  return (
    <>
      <NewIngredientPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <NewIngredientPageContent />
      </Suspense>
    </>
  );
}
