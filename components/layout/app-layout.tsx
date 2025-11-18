import type React from "react"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"
import type { User } from "@supabase/supabase-js"

interface AppLayoutProps {
  children: React.ReactNode
  user: User
  title: string
}

export function AppLayout({ children, user, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f9fafc]">
      <AppSidebar />

      {/* Main content area - adjusts based on sidebar width */}
      <div className="flex-1 lg:pl-60 max-w-full overflow-hidden">
        <AppHeader user={user} title={title} />
        <main className="p-6 max-w-full">{children}</main>
      </div>
    </div>
  )
}
