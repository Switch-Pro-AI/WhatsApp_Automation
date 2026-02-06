"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, Tenant } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, LogOut, User as UserIcon, Settings } from "lucide-react"
import { NotificationDropdown } from "@/components/common/notification-dropdown"

interface DashboardHeaderProps {
  user: User
  tenant: Tenant
}

export function DashboardHeader({ user, tenant }: DashboardHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search contacts, conversations..."
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button size="sm" className="gap-2" onClick={() => router.push("/dashboard/inbox?new=true")}>
          <Plus className="w-4 h-4" />
          New Message
        </Button>

        {/* Notifications */}
        <NotificationDropdown tenantId={tenant.id} />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings/profile")}>
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
