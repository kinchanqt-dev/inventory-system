"use client";

import { ROLE_LABELS } from "@/enums";

import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";

const STAFF_ROLES = ["CASHIER", "COOK"] as const;

export function CreateStaffRoleFieldset() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Role</legend>
      <RadioGroup
        name="role"
        defaultValue="CASHIER"
        required
        className="grid grid-cols-2 gap-2"
      >
        {STAFF_ROLES.map((role) => (
          <Label
            key={role}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border/70 bg-background px-3 text-sm has-data-checked:border-primary has-data-checked:bg-primary/5"
          >
            <RadioGroupItem value={role} />
            {ROLE_LABELS[role]}
          </Label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
