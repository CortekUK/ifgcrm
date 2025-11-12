"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Users } from "lucide-react"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">IFG CRM</h1>
              <p className="text-xs text-muted-foreground">International Football Academy</p>
            </div>
          </div>
          {/* </CHANGE> */}

          <nav className="hidden items-center gap-6 md:flex">
            <a href="/dashboard" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Dashboard
            </a>
            <a href="/players" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Players
            </a>
            <a href="/pipelines" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Pipelines
            </a>
            <a href="/invoices" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Invoices
            </a>
            <a href="/settings" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Settings
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  {/* </CHANGE> */}
                  <span className="hidden text-sm font-medium md:inline-block">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
