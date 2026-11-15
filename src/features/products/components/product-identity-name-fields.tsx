import { Input, Label, Textarea } from "@/components/ui";

interface ProductIdentityNameFieldsProps {
  product?: {
    name?: string;
    description?: string | null;
  };
}

export function ProductIdentityNameFields({
  product,
}: Readonly<ProductIdentityNameFieldsProps>) {
  return (
    <>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={product?.name}
          placeholder="Chicken rice meal"
          required
          className="min-h-11"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          placeholder="Short note for staff"
          className="min-h-24"
        />
      </div>
    </>
  );
}