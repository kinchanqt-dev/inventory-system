import { appShellSessionProps } from "@/lib/app-shell-session";
import Link from "next/link";

import { loadOwnerIngredientsPage } from "@/lib/owner-ingredients-page";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { IngredientsTable } from "@/features/ingredients";

export const instant = false;

export default async function IngredientsPage() {
  const { session, ingredients, branding } = await loadOwnerIngredientsPage();

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Ingredients"
      branding={branding}
    >
      <PageBreadcrumb items={[{ label: "Ingredients" }]} />
      <PageToolbar
        description="Track purchased goods, pack costs, yield, and kitchen stock for recipes."
        hint="True cost per unit includes yield loss from trimming or cooking waste."
        actions={
          <Button
            className="min-h-11 w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/ingredients/new" />}
          >
            Add ingredient
          </Button>
        }
      />
      <IngredientsTable ingredients={ingredients} />
    </AppShell>
  );
}
