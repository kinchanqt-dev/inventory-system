import { Input, Label } from "@/components/ui";

interface ProductPricingReorderFieldProps {
  reorderLevel?: number;
}

export function ProductPricingReorderField({
  reorderLevel,
}: Readonly<ProductPricingReorderFieldProps>) {
  return (
    <div className="space-y-2">
      <Label htmlFor="reorderLevel">Low stock alert</Label>
      <Input
        id="reorderLevel"
        name="reorderLevel"
        type="number"
        min="0"
        defaultValue={reorderLevel && reorderLevel > 0 ? reorderLevel : ""}
        placeholder="0"
        className="min-h-11"
        aria-describedby="reorderLevelHelp"
      />
      <p id="reorderLevelHelp" className="text-xs text-muted-foreground">
        Mark as Low when on hand reaches this number.
      </p>
    </div>
  );
}