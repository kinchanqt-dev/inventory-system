"use client";

import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";

import type {
  CategoryOption,
  ProductFormValues,
} from "@/features/products/types/product.types";

interface ProductIdentityFieldsProps {
  categories: CategoryOption[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
  product?: Pick<
    ProductFormValues,
    "sku" | "barcode" | "name" | "description" | "unit"
  >;
}

export function ProductIdentityFields({
  categories,
  categoryId,
  onCategoryChange,
  product,
}: Readonly<ProductIdentityFieldsProps>) {
  const categoryItems = [
    { value: null, label: "Select category" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

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
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={categoryId || null}
          onValueChange={(value) => onCategoryChange(value ?? "")}
          items={categoryItems}
        >
          <SelectTrigger id="category" className="min-h-11 w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
    </>
  );
}
