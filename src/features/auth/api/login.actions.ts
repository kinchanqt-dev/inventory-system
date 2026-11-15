"use server";

import { redirect } from "next/navigation";

import { firstZodIssueMessage } from "@/lib/first-zod-issue";
import {
  clearSupportOrganizationId,
  ensurePlatformAdminMetadata,
  ensureUserProfile,
} from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

import { redirectAfterLogin } from "@/features/auth/lib/login-redirect";
import { signInErrorMessage } from "@/features/auth/lib/auth-error-message";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { registerSchema } from "@/features/auth/schemas/register.schema";

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

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
  });

  if (error) {
    return { error: signInErrorMessage(error) };
  }

  const {
    data: { user: signedIn },
  } = await supabase.auth.getUser();

  if (!signedIn) {
    redirect("/");
  }

  await ensureUserProfile(signedIn);
  const user = await ensurePlatformAdminMetadata(signedIn);
  await redirectAfterLogin(user);
}

export async function registerAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: firstZodIssueMessage(parsed.error.issues, "Invalid input"),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email.trim().toLowerCase(),
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      error:
        "Account created, but email confirmation is required. Disable Confirm email in Supabase → Authentication → Providers → Email, then sign in.",
    };
  }

  redirect("/onboarding");
}

export async function logoutAction() {
  await clearSupportOrganizationId();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}