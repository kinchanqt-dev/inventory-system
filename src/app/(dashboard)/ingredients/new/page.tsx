import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";

import {
  IngredientForm,
  listIngredientCategories,
} from "@/features/ingredients";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function NewIngredientPage() {
  const session = await requireRole(["OWNER"]);
  const [categories, branding] = await Promise.all([
    listIngredientCategories(),
    getShopBranding(),
  ]);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Add ingredient"
      branding={branding}
    >
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
      <IngredientForm categories={categories} />
    </AppShell>
  );
}