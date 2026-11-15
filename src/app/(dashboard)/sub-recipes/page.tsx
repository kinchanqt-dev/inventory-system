import Link from "next/link";
import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { listSubRecipes, SubRecipesTable } from "@/features/sub-recipes";

function SubRecipesPageChrome() {
  return (
    <>
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
    </>
  );
}

async function SubRecipesPageContent() {
  await requireRole(["OWNER"]);
  const subRecipes = await listSubRecipes();
  return <SubRecipesTable subRecipes={subRecipes} />;
}

export default function SubRecipesPage() {
  return (
    <>
      <SubRecipesPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <SubRecipesPageContent />
      </Suspense>
    </>
  );
}
