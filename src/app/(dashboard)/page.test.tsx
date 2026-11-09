import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({
  requireSession: vi.fn(async () => ({
    user: { id: "u1", name: "Owner", role: "OWNER" },
  })),
}));

vi.mock("@/features/sales/api/sales.queries", () => ({
  getDashboardStats: vi.fn(async () => ({
    revenueCents: 0,
    completedToday: 0,
    lowStockCount: 0,
    productCount: 0,
    byMethod: {},
  })),
  listRecentSales: vi.fn(async () => []),
}));

vi.mock("@/features/inventory/api/inventory.queries", () => ({
  listLowStock: vi.fn(async () => []),
}));

vi.mock("@/components/layout", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PageToolbar: ({
    description,
    actions,
  }: {
    description: string;
    actions?: React.ReactNode;
  }) => (
    <div>
      <p>{description}</p>
      {actions}
    </div>
  ),
}));

import DashboardPage from "@/app/(dashboard)/page";

describe("DashboardPage", () => {
  it("exposes the dashboard page entry", () => {
    expect(typeof DashboardPage).toBe("function");
  });
});
