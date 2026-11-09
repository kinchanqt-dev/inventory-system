import { requireRole } from "@/lib/session";

import { AppShell, PageToolbar } from "@/components/layout";

import { InventoryTable, listInventory } from "@/features/inventory";
import { getShopBranding } from "@/features/settings";

export const instant = false;

export default async function InventoryPage() {
  const session = await requireRole(["OWNER"]);
  const [items, branding] = await Promise.all([
    listInventory(),
    getShopBranding(),
  ]);

  return (
    <AppShell
      name={session.user.name ?? "Owner"}
      role={session.user.role}
      title="Inventory"
      branding={branding}
    >
      <PageToolbar
        description="Update stock for deliveries, spoilage, free items, or staff meals. Each change is saved."
        hint="Low means current stock is at or below the item’s low stock alert."
      />
      <InventoryTable items={items} />
    </AppShell>
  );
}
