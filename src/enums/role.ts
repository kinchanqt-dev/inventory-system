export type RoleValue = "OWNER" | "CASHIER" | "COOK";

export const ROLE_LABELS: Record<RoleValue, string> = {
  OWNER: "Owner",
  CASHIER: "Cashier",
  COOK: "Cook",
};

/** Default landing path after login / forbidden access. */
export function homePathForRole(role: RoleValue): string {
  switch (role) {
    case "COOK":
      return "/kitchen";
    case "CASHIER":
      return "/pos";
    default:
      return "/";
  }
}
