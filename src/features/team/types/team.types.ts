import type { RoleValue } from "@/enums";

export interface TeamMember {
  userId: string;
  name: string;
  email: string | null;
  role: RoleValue;
  createdAt: string;
}
