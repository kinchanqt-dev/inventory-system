"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";

import { loginSchema } from "@/features/auth/schemas/login.schema";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password" };
  }

  const rawCallbackUrl = formData.get("callbackUrl");
  const callbackUrl =
    typeof rawCallbackUrl === "string" && rawCallbackUrl.length > 0
      ? rawCallbackUrl
      : "/";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }

    throw error;
  }

  redirect(callbackUrl);
}

export async function logoutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/login" });
}
