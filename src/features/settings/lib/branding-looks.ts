export interface BrandingLook {
  id: string;
  label: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

export const BRANDING_LOOKS: BrandingLook[] = [
  {
    id: "warm-kitchen",
    label: "Warm kitchen",
    description: "Cream pages with caramel buttons",
    primaryColor: "#8f684c",
    accentColor: "#a77b5b",
    backgroundColor: "#efe6dd",
  },
  {
    id: "fresh-green",
    label: "Fresh green",
    description: "Clean light pages with forest green",
    primaryColor: "#1a1a1a",
    accentColor: "#2f5d50",
    backgroundColor: "#f4f7f5",
  },
  {
    id: "bold-black",
    label: "Bold black",
    description: "Strong black buttons on bright white",
    primaryColor: "#111111",
    accentColor: "#1f6b5a",
    backgroundColor: "#f7f7f5",
  },
];
