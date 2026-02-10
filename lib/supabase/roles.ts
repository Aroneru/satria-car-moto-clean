import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "superadmin";

export async function getUserRole() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return { user: null, role: null, isSuperadmin: false };
  }

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.sub)
    .maybeSingle();

  const role = (roleRow?.role as AdminRole | undefined) ?? null;

  return { user, role, isSuperadmin: role === "superadmin" };
}

export async function requireAdmin() {
  const { user, role, isSuperadmin } = await getUserRole();

  if (!user) {
    redirect("/auth/login");
  }

  if (role !== "admin" && role !== "superadmin") {
    redirect("/protected");
  }

  return { user, role: role as AdminRole, isSuperadmin };
}

export async function requireSuperadmin() {
  const { user, role } = await getUserRole();

  if (!user) {
    redirect("/auth/login");
  }

  if (role !== "superadmin") {
    redirect("/protected");
  }

  return { user, role: role as AdminRole };
}
