import Link from "next/link";
import { Suspense } from "react";

import { loadOwnerIngredientsPage } from "@/lib/owner-ingredients-page";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";
import { PageBreadcrumb } from "@/components/shared";
import { Button } from "@/components/ui";

import { IngredientsTable } from "@/features/ingredients";

function IngredientsPageChrome() {
  return (
    <>
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
    </>
  );
}

async function IngredientsPageContent() {
  const { ingredients } = await loadOwnerIngredientsPage();
  return <IngredientsTable ingredients={ingredients} />;
}

export default function IngredientsPage() {
  return (
    <>
      <IngredientsPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <IngredientsPageContent />
      </Suspense>
    </>
  );
}
