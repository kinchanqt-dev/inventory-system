import { Input, Label } from "@/components/ui";

import type { CategoryKind } from "@/types/database.types";

interface CategoryFormFieldsProps {
  defaultName?: string;
  kind: CategoryKind;
  nameId: string;
}

export function CategoryFormFields({
  defaultName = "",
  kind,
  nameId,
}: Readonly<CategoryFormFieldsProps>) {
  return (
    <>
      <input type="hidden" name="kind" value={kind} />
      <div className="space-y-2">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          id={nameId}
          name="name"
          type="text"
          defaultValue={defaultName}
          placeholder={kind === "menu" ? "e.g. Mains" : "e.g. Produce"}
          required
          maxLength={80}
          className="min-h-11"
        />
      </div>
    </>
  );
}
