import { Input, Label } from "@/components/ui";

interface ProductIdentityUnitFieldProps {
  product?: { unit?: string };
}

export function ProductIdentityUnitField({
  product,
}: Readonly<ProductIdentityUnitFieldProps>) {
  return (
    <div className="space-y-2">
      <Label htmlFor="unit">Sold as</Label>
      <Input
        id="unit"
        name="unit"
        defaultValue={product?.unit ?? "pc"}
        placeholder="pc"
        className="min-h-11"
        aria-describedby="unitHelp"
      />
      <p id="unitHelp" className="text-xs text-muted-foreground">
        How you sell it — pc, cup, pack, bowl, etc.
      </p>
    </div>
  );
}