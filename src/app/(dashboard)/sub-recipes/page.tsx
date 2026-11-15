import Link from "next/link";

import { requireRole } from "@/lib/session";
import { appShellSessionProps } from "@/lib/app-shell-session";

import { AppShell, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { listSubRecipes, SubRecipesTable } from "@/features/sub-recipes";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function SubRecipesPage() {
  const session = await requireRole(["OWNER"]);
  const [subRecipes, branding] = await Promise.all([
    listSubRecipes(),
    getShopBranding(),
  ]);

  return (
    <AppShell
      {...appShellSessionProps(session)}
      title="Sub-recipes"
      branding={branding}
    >
      <PageBreadcrumb items={[{ label: "Sub-recipes" }]} />
      <PageToolbar
        description="Build prep batches from ingredients and see true batch cost."
        hint="Batch cost per unit is total ingredient cost divided by batch yield."
        actions={
          <Button
            className="min-h-11 w-full sm:w-auto"
            nativeButton={false}
            render={<Link href="/sub-recipes/new" />}
          >
            Add sub-recipe
          </Button>
        }
      />
      <SubRecipesTable subRecipes={subRecipes} />
    </AppShell>
  );
}