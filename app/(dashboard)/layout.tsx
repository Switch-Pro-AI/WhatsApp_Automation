import React from "react"
import { getCurrentUser, getCurrentTenant } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const tenant = await getCurrentTenant()

  if (!tenant) {
    redirect("/login")
  }

  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 animate-gradient">
=======
    <div className="flex h-screen bg-background">
>>>>>>> aa992935bc6a2d96a9f1b8f1da60461b23f61d04
      <DashboardSidebar user={user} tenant={tenant} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} tenant={tenant} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
