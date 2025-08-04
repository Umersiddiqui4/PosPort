"use client"

import Roles from "@/components/roles"
import { useUserDataStore } from "@/lib/store"
import { redirect } from "next/navigation"

export default function RolesPage() {
  const user = useUserDataStore((state) => state.user);

  // Redirect COMPANY_OWNER users as they shouldn't access roles
  if (user?.role === "COMPANY_OWNER") {
    redirect("/");
  }

  return <Roles />
}
