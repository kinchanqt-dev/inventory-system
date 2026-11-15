import { z } from "zod";

import { validateKnownOrCatalogUnit } from "@/lib/food-cost/unit-validation";

/** Accepts catalog or legacy codes still stored on existing rows. */
export const knownUnitSchema = z
  .string()
  .trim()
  .min(1, "Unit is required")
  .superRefine((value, ctx) => {
    const error = validateKnownOrCatalogUnit(value);
    if (error) {
      ctx.addIssue({ code: "custom", message: error });
    }
  });
