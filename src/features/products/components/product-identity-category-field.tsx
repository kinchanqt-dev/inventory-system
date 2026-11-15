import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import type { CategoryOption } from "@/features/products/types/product.types";

interface ProductIdentityCategoryFieldProps {
  categories: CategoryOption[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
}

export function ProductIdentityCategoryField({
  categories,
  categoryId,
  onCategoryChange,
}: Readonly<ProductIdentityCategoryFieldProps>) {
  const categoryItems = [
    { value: null, label: "Select category" },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  return (
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
  );
}