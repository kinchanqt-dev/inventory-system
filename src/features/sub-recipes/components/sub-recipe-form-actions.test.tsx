import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SubRecipeFormActions } from "@/features/sub-recipes/components/sub-recipe-form-actions";

afterEach(() => {
  cleanup();
});

describe("SubRecipeFormActions", () => {
  it("renders create actions without delete", () => {
    const onCancel = vi.fn();
    render(
      <SubRecipeFormActions
        isEdit={false}
        isPending={false}
        isDeleting={false}
        submitLabel="Create sub-recipe"
        onCancel={onCancel}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText("Delete sub-recipe")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("renders delete while editing", () => {
    render(
      <SubRecipeFormActions
        isEdit
        isPending={false}
        isDeleting
        submitLabel="Update sub-recipe"
        onCancel={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});
