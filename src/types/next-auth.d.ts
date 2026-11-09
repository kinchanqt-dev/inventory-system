import type { DefaultSession } from "next-auth";

import type { RoleValue } from "@/enums";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: RoleValue;
    };
  }

  interface User {
    role: RoleValue;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleValue;
  }
}
