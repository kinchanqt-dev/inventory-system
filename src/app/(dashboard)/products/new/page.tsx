import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { listIngredients } from "@/features/ingredients";
import { listMenuCategories } from "@/features/products";
import { ProductCreateForm } from "@/features/products/components/product-create-form";
import {
  foodCostSettingsFromOrg,
  toRecipeEditorOptions,
} from "@/features/products/lib/load-edit-product-page";
import { listSubRecipes } from "@/features/sub-recipes";

function NewProductPageChrome() {
  return (
    <>
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
    </>
  );
}

async function NewProductPageContent() {
  const session = await requireRole(["OWNER"]);
  const [categories, ingredients, subRecipes] = await Promise.all([
    listMenuCategories(),
    listIngredients(),
    listSubRecipes(),
  ]);
  const recipeOptions = toRecipeEditorOptions(ingredients, subRecipes);

  return (
    <ProductCreateForm
      categories={categories}
      foodCostSettings={foodCostSettingsFromOrg(session.organization)}
      {...recipeOptions}
    />
  );
}

export default function NewProductPage() {
  return (
    <>
      <NewProductPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <NewProductPageContent />
      </Suspense>
    </>
  );
}
