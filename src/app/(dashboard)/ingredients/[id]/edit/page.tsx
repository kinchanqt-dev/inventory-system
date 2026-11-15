import { notFound } from "next/navigation";
import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import {
  getIngredient,
  IngredientForm,
  listIngredientCategories,
} from "@/features/ingredients";
import { toIngredientFormValues } from "@/features/ingredients/lib/to-ingredient-form-values";

interface EditIngredientPageProps {
  params: Promise<{ id: string }>;
}

async function EditIngredientPageContent({
  params,
}: Readonly<EditIngredientPageProps>) {
  await requireRole(["OWNER"]);
  const { id } = await params;
  const [ingredient, categories] = await Promise.all([
    getIngredient(id),
    listIngredientCategories(),
  ]);

  if (!ingredient) {
    notFound();
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Ingredients", href: "/ingredients" },
          { label: `Edit ${ingredient.name}` },
        ]}
      />
      <PageToolbar
        description="Update pack cost, yield, supplier, and low-stock alert."
        hint="Use Adjust on the list page to record deliveries or usage."
      />
      <IngredientForm
        categories={categories}
        ingredient={toIngredientFormValues(ingredient)}
      />
    </>
  );
}

export default function EditIngredientPage({
  params,
}: Readonly<EditIngredientPageProps>) {
  return (
    <Suspense fallback={<PageBodySkeleton />}>
      <EditIngredientPageContent params={params} />
    </Suspense>
  );
}
