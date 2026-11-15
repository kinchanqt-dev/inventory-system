import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SettingsForm } from "@/features/settings/components/settings-form";
import { DEFAULT_BRANDING } from "@/features/settings/lib/normalize-branding";

vi.mock("@/features/settings/api/settings.actions", () => ({
  updateShopSettingsAction: vi.fn(),
}));

describe("SettingsForm", () => {
  it("renders branding fields", () => {
    render(<SettingsForm branding={DEFAULT_BRANDING} />);

    expect(screen.getByLabelText("Shop name")).toBeInTheDocument();
    expect(screen.getByLabelText("Main button color")).toBeInTheDocument();
    expect(screen.getByLabelText("Page background")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Warm kitchen/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Upload logo")).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop an image here/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Target food cost %")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save settings" }),
    ).toBeInTheDocument();
  });
});
