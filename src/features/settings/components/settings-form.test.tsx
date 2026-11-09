import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsForm } from "@/features/settings/components/settings-form";

vi.mock("@/features/settings/api/settings.actions", () => ({
  updateShopSettingsAction: vi.fn(),
}));

describe("SettingsForm", () => {
  it("renders branding fields", () => {
    render(
      <SettingsForm
        branding={{
          shopTitle: "Inventory POS",
          tagline: "Local Food",
          logoPath: null,
          primaryColor: "#1a1a1a",
          accentColor: "#2f5d50",
          backgroundColor: "#f7f4ef",
        }}
      />,
    );

    expect(screen.getByLabelText("Shop name")).toBeInTheDocument();
    expect(screen.getByLabelText("Main button color")).toBeInTheDocument();
    expect(screen.getByLabelText("Page background")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Warm kitchen/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Upload logo")).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop an image here/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save shop look" }),
    ).toBeInTheDocument();
  });
});
