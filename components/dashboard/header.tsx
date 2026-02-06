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
import { Search, Bell, Plus, LogOut, User as UserIcon, Settings } from "lucide-react"
import useSWR from "swr"

interface DashboardHeaderProps {
  user: User
  tenant: Tenant
}

// SWR fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  // Fetch notification count
  const { data: notifications, error: notificationError, mutate } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

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

  // Refresh notifications when navigating to inbox
  useEffect(() => {
    // In Next.js 13+ with App Router, we don't have router.events
    // Instead, we rely on the refreshInterval in SWR
  }, []);

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
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative" 
          onClick={() => {
            router.push("/dashboard/inbox");
            mutate(); // Refresh notification count after navigation
          }}
        >
          <Bell className="w-5 h-5" />
          {notifications?.total_notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.total_notifications > 99 ? '99+' : notifications.total_notifications}
            </span>
          )}
        </Button>

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
