import { notFound } from "next/navigation";

import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import { ProductForm, RecipeEditor } from "@/features/products";
import {
  foodCostSettingsFromOrg,
  loadEditProductPageData,
  toRecipeEditorOptions,
} from "@/features/products/lib/load-edit-product-page";
import { toProductFormValues } from "@/features/products/lib/to-product-form-values";
import { getShopBranding } from "@/features/settings";

export const instant = false;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: Readonly<EditProductPageProps>) {
  const session = await requireRole(["OWNER"]);
  const { id } = await params;
  const branding = await getShopBranding();
  const { product, categories, recipe, ingredients, subRecipes } =
    await loadEditProductPageData(id);

  if (!product || !recipe) {
    notFound();
  }

  const recipeOptions = toRecipeEditorOptions(ingredients, subRecipes);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title={`Edit ${product.name}`}
      branding={branding}
    >
      <PageBreadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: `Edit ${product.name}` },
        ]}
      />
      <PageToolbar
        description="Change the item’s name, photo, recipe, and selling price."
        hint="Save the recipe first so food cost is clear before you set price."
      />
      <RecipeEditor
        productId={product.id}
        initialLines={recipe.lines}
        portionsPerBatch={recipe.portionsPerBatch}
        menuPriceCents={recipe.menuPriceCents}
        laborCents={recipe.laborCents}
        packagingCents={recipe.packagingCents}
        foodCostSettings={foodCostSettingsFromOrg(session.organization)}
        {...recipeOptions}
      />
      <ProductForm
        categories={categories}
        product={toProductFormValues(product)}
      />
    </AppShell>
  );
}
