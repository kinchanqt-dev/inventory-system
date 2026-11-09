import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import type { RoleValue } from "@/enums";

export async function requireSession() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

export async function requireRole(roles: RoleValue[]) {
  const session = await requireSession();

  if (!roles.includes(session.user.role)) {
    redirect("/pos");
  }

  return session;
}
