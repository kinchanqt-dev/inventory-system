import { notFound } from "next/navigation";

import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listIngredients } from "@/features/ingredients";
import { getSubRecipe, SubRecipeForm } from "@/features/sub-recipes";
import { toSubRecipeFormValues } from "@/features/sub-recipes/lib/to-sub-recipe-form-values";
import { getShopBranding } from "@/features/settings";

import type { SubRecipeIngredientOption } from "@/features/sub-recipes/types/sub-recipe.types";

export const instant = false;

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

export default async function EditSubRecipePage({
  params,
}: Readonly<EditSubRecipePageProps>) {
  const session = await requireRole(["OWNER"]);
  const { id } = await params;
  const [subRecipe, ingredients, branding] = await Promise.all([
    getSubRecipe(id),
    listIngredients(),
    getShopBranding(),
  ]);

  if (!subRecipe) {
    notFound();
  }

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title={`Edit ${subRecipe.name}`}
      branding={branding}
    >
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
    </AppShell>
  );
}