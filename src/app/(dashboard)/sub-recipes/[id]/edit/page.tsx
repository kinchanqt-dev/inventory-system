import { notFound } from "next/navigation";
import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listIngredients } from "@/features/ingredients";
import { getSubRecipe, SubRecipeForm } from "@/features/sub-recipes";
import { toSubRecipeFormValues } from "@/features/sub-recipes/lib/to-sub-recipe-form-values";

import type { SubRecipeIngredientOption } from "@/features/sub-recipes/types/sub-recipe.types";

interface EditSubRecipePageProps {
  params: Promise<{ id: string }>;
}

function toIngredientOptions(
  ingredients: Awaited<ReturnType<typeof listIngredients>>,
): SubRecipeIngredientOption[] {
  return ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    packUnit: ingredient.packUnit,
  }));
}

async function EditSubRecipePageContent({
  params,
}: Readonly<EditSubRecipePageProps>) {
  await requireRole(["OWNER"]);
  const { id } = await params;
  const [subRecipe, ingredients] = await Promise.all([
    getSubRecipe(id),
    listIngredients(),
  ]);

  if (!subRecipe) {
    notFound();
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Sub-recipes", href: "/sub-recipes" },
          { label: `Edit ${subRecipe.name}` },
        ]}
      />
      <PageToolbar
        description="Update batch yield or replace ingredient lines — costs refresh from ingredient data."
        hint="Deleting is blocked while this sub-recipe is used on a menu item."
      />
      <SubRecipeForm
        ingredients={toIngredientOptions(ingredients)}
        subRecipe={toSubRecipeFormValues(subRecipe)}
      />
    </>
  );
}

export default function EditSubRecipePage({
  params,
}: Readonly<EditSubRecipePageProps>) {
  return (
    <Suspense fallback={<PageBodySkeleton />}>
      <EditSubRecipePageContent params={params} />
    </Suspense>
  );
}
