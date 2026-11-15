import { Suspense } from "react";

import { requireRole } from "@/lib/session";

import { PageBodySkeleton, PageToolbar } from "@/components/layout";

import { InventoryTable, listInventory } from "@/features/inventory";

function InventoryPageChrome() {
  return (
    <PageToolbar
      description="Update stock for deliveries, spoilage, free items, or staff meals. Each change is saved."
      hint="Low means current stock is at or below the item’s low stock alert."
    />
  );
}

async function InventoryPageContent() {
  await requireRole(["OWNER"]);
  const items = await listInventory();
  return <InventoryTable items={items} />;
}

export default function InventoryPage() {
  return (
    <>
      <InventoryPageChrome />
      <Suspense fallback={<PageBodySkeleton />}>
        <InventoryPageContent />
      </Suspense>
    </>
  );
}
