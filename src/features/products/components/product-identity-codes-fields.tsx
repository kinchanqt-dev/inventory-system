import { Input, Label } from "@/components/ui";

interface ProductIdentityCodesFieldsProps {
  product?: {
    sku?: string;
    barcode?: string | null;
  };
}

export function ProductIdentityCodesFields({
  product,
}: Readonly<ProductIdentityCodesFieldsProps>) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="sku">Item code</Label>
        <Input
          id="sku"
          name="sku"
          defaultValue={product?.sku}
          placeholder="RICE-MEAL-A"
          required
          className="min-h-11"
          aria-describedby="skuHelp"
        />
        <p id="skuHelp" className="text-xs text-muted-foreground">
          Short code staff use to find this item (example: RICE-MEAL-A).
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="barcode">Product code</Label>
        <Input
          id="barcode"
          name="barcode"
          defaultValue={product?.barcode ?? ""}
          placeholder="Optional product code"
          className="min-h-11"
        />
      </div>
    </>
  );
}