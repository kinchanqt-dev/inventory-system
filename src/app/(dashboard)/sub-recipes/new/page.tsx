import { appShellSessionProps } from "@/lib/app-shell-session";
import { loadOwnerIngredientsPage } from "@/lib/owner-ingredients-page";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { SubRecipeForm } from "@/features/sub-recipes";

import type { SubRecipeIngredientOption } from "@/features/sub-recipes/types/sub-recipe.types";

export const instant = false;

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

export default async function NewSubRecipePage() {
  const { session, ingredients, branding } = await loadOwnerIngredientsPage();

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Add sub-recipe"
      branding={branding}
    >
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
      <SubRecipeForm ingredients={toIngredientOptions(ingredients)} />
    </AppShell>
  );
}
