import { notFound } from "next/navigation";

import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import {
  getIngredient,
  IngredientForm,
  listIngredientCategories,
} from "@/features/ingredients";
import { toIngredientFormValues } from "@/features/ingredients/lib/to-ingredient-form-values";
import { getShopBranding } from "@/features/settings";

export const instant = false;

interface EditIngredientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIngredientPage({
  params,
}: Readonly<EditIngredientPageProps>) {
  const session = await requireRole(["OWNER"]);
  const { id } = await params;
  const [ingredient, categories, branding] = await Promise.all([
    getIngredient(id),
    listIngredientCategories(),
    getShopBranding(),
  ]);

  if (!ingredient) {
    notFound();
  }

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title={`Edit ${ingredient.name}`}
      branding={branding}
    >
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
    </AppShell>
  );
}