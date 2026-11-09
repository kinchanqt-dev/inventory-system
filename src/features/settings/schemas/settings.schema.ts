import { z } from "zod";

import { isHexColor, isLightBackground } from "@/lib/color-contrast";

const hexColor = (label: string) =>
  z
    .string()
    .trim()
    .refine(isHexColor, `${label} must be a 6-digit color code`);

export const settingsSchema = z.object({
  shopTitle: z.string().trim().min(1, "Shop name is required").max(80),
  tagline: z.string().trim().max(80).optional(),
  primaryColor: hexColor("Main button color"),
  accentColor: hexColor("Highlight color"),
  backgroundColor: hexColor("Page background").refine(
    isLightBackground,
    "Page background should stay light so text is easy to read",
  ),
  removeLogo: z.boolean().optional(),
});
