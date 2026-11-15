import { Suspense } from "react";

import { loadOwnerIngredientsPage } from "@/lib/owner-ingredients-page";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { SubRecipeForm } from "@/features/sub-recipes";

import type { SubRecipeIngredientOption } from "@/features/sub-recipes/types/sub-recipe.types";

function toIngredientOptions(
  ingredients: Awaited<
    ReturnType<typeof loadOwnerIngredientsPage>
  >["ingredients"],
): SubRecipeIngredientOption[] {
  return ingredients.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
    packUnit: ingredient.packUnit,
  }));
}

function NewSubRecipePageChrome() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Sub-recipes", href: "/sub-recipes" },
          { label: "Add sub-recipe" },
        ]}
      />
      <PageToolbar
        description="Define a prep batch and which ingredients go into one yield."
        hint="Choose batch quantity and unit first — menu recipes will reference that yield."
      />
    </>
  );
}

async function NewSubRecipePageContent() {
  const { ingredients } = await loadOwnerIngredientsPage();
  return <SubRecipeForm ingredients={toIngredientOptions(ingredients)} />;
}

export default function NewSubRecipePage() {
  return (
    <>
      <NewSubRecipePageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <NewSubRecipePageContent />
      </Suspense>
    </>
  );
}
