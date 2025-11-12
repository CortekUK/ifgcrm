"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function setupAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const adminClient = createAdminClient()

  // Create user with admin client (bypasses email verification)
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: "Super Admin",
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Create profile with admin role
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    email: authData.user.email,
    full_name: "Super Admin",
    role: "admin",
  })

  if (profileError) {
    return { error: profileError.message }
  }

  redirect("/auth/login?setup=success")
}
