import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listIngredients } from "@/features/ingredients";
import { listMenuCategories } from "@/features/products";
import { ProductCreateForm } from "@/features/products/components/product-create-form";
import {
  foodCostSettingsFromOrg,
  toRecipeEditorOptions,
} from "@/features/products/lib/load-edit-product-page";
import { getShopBranding } from "@/features/settings";
import { listSubRecipes } from "@/features/sub-recipes";

export const instant = false;

export default async function NewProductPage() {
  const session = await requireRole(["OWNER"]);
  const [categories, branding, ingredients, subRecipes] = await Promise.all([
    listMenuCategories(),
    getShopBranding(),
    listIngredients(),
    listSubRecipes(),
  ]);
  const recipeOptions = toRecipeEditorOptions(ingredients, subRecipes);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Add product"
      branding={branding}
    >
      <PageBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: "Add product" },
        ]}
      />
      <PageToolbar
        description="Set price, stock, and the recipe ingredients in one step."
        hint="Food cost updates live as you add ingredient or sub-recipe lines."
      />
      <ProductCreateForm
        categories={categories}
        foodCostSettings={foodCostSettingsFromOrg(session.organization)}
        {...recipeOptions}
      />
    </AppShell>
  );
}
