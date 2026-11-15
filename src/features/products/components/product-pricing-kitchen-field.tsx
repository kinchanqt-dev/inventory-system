import { Label } from "@/components/ui";

import type { ProductFormValues } from "@/features/products/types/product.types";

interface ProductPricingKitchenFieldProps {
  product?: Pick<ProductFormValues, "sendsToKitchen">;
}

export function ProductPricingKitchenField({
  product,
}: Readonly<ProductPricingKitchenFieldProps>) {
  const defaultChecked = product?.sendsToKitchen ?? true;

  return (
    <div className="flex items-start gap-3 text-sm sm:col-span-2">
      <input
        id="sendsToKitchen"
        type="checkbox"
        name="sendsToKitchen"
        value="true"
        defaultChecked={defaultChecked}
        aria-describedby="sendsToKitchen-hint"
        className="mt-1 size-4 rounded border-border"
      />
      <div>
        <Label htmlFor="sendsToKitchen">Send to kitchen</Label>
        <p
          id="sendsToKitchen-hint"
          className="mt-0.5 text-xs text-muted-foreground"
        >
          When checked, this item appears on the kitchen board after a POS sale.
          Uncheck for drinks or packaging.
        </p>
      </div>
    </div>
  );
}