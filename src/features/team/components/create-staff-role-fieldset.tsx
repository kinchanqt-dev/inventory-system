import { ROLE_LABELS } from "@/enums";

const STAFF_ROLES = ["CASHIER", "COOK"] as const;

export function CreateStaffRoleFieldset() {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">Role</legend>
      <div className="grid grid-cols-2 gap-2">
        {STAFF_ROLES.map((role) => (
          <label
            key={role}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-sm has-checked:border-primary has-checked:bg-primary/5"
          >
            <input
              type="radio"
              name="role"
              value={role}
              defaultChecked={role === "CASHIER"}
              className="size-4 accent-primary"
              required
            />
            {ROLE_LABELS[role]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
