"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, GitBranch, Megaphone, FileText, BarChart3, Receipt, CreditCard, Settings, UserCog, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Workflow, MapPin, MessageSquare, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

const navigationGroups = [
  {
    name: "CRM",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Players", href: "/players", icon: Users },
      { name: "Pipelines", href: "/pipelines", icon: GitBranch },
    ],
  },
  {
    name: "Marketing",
    items: [
      { name: "Contacts", href: "/contacts", icon: Users },
      { name: "Campaigns", href: "/campaigns", icon: Megaphone },
      { name: "Automations", href: "/automations", icon: Workflow },
      { name: "Replies", href: "/replies", icon: Mail },
      { name: "Templates", href: "/templates", icon: FileText },
      { name: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    name: "Finance",
    items: [
      { name: "Invoices", href: "/invoices", icon: Receipt },
      { name: "Payments", href: "/payments", icon: CreditCard },
    ],
  },
  {
    name: "Admin",
    items: [
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "Users", href: "/users", icon: UserCog },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["CRM", "Marketing", "Finance", "Admin"])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleGroup = (groupName: string) => {
    if (collapsed) return

    setExpandedGroups((prev) => (prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]))
  }

  const isGroupActive = (items: (typeof navigationGroups)[0]["items"]) => {
    return items.some((item) => pathname === item.href || pathname?.startsWith(item.href + "/"))
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col shadow-2xl transition-all duration-300",
          "bg-gradient-to-b from-[#0A47B1] to-[#1739C0] shadow-[4px_0_16px_rgba(0,0,0,0.15)]",
          collapsed ? "w-20" : "w-60",
        )}
      >
        <style jsx>{`
          .ifg-section-header {
            font-family: 'Oswald', sans-serif;
            font-weight: 700;
            letter-spacing: 0.1em;
          }
        `}</style>

        <div className="flex h-20 items-center border-b border-white/10 px-4 py-5">
          {!collapsed ? (
            <div className="flex items-start gap-3">
              {/* Map Pin Icon with Globe */}
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <MapPin className="h-10 w-10 text-white fill-white" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  <svg
                    className="h-3.5 w-3.5 text-[#0A47B1]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" strokeWidth="1.5" />
                    <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col leading-none">
                <div className="text-[8px] font-bold tracking-[0.15em] text-white/90 mb-0.5">THE INTERNATIONAL</div>
                <div className="text-[18px] font-black tracking-tight text-white leading-[1.1]">FOOTBALL</div>
                <div className="text-[18px] font-black tracking-tight text-white leading-[1.1]">GROUP</div>
              </div>
            </div>
          ) : (
            <div className="mx-auto relative flex h-10 w-10 items-center justify-center">
              <MapPin className="h-10 w-10 text-white fill-white" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <svg
                  className="h-3.5 w-3.5 text-[#0A47B1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Grouped Sections */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {navigationGroups.map((group, groupIndex) => {
            const isExpanded = expandedGroups.includes(group.name)
            const hasActiveItem = isGroupActive(group.items)

            return (
              <div key={group.name} className="space-y-1">
                {/* Group Header */}
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-1.5 transition-colors",
                      "ifg-section-header text-[10px] uppercase tracking-[0.12em] leading-tight",
                      hasActiveItem ? "text-white" : "text-blue-200 hover:text-white",
                    )}
                  >
                    <span>{group.name}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                )}

                {/* Group Items */}
                {(collapsed || isExpanded) && (
                  <div
                    className={cn("space-y-1", !collapsed && "animate-in fade-in-0 slide-in-from-top-2 duration-200")}
                  >
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-full px-3 text-sm font-medium transition-all duration-200",
                            "h-11",
                            isActive
                              ? "bg-white text-[#0A47B1] font-bold shadow-[0_0_0_4px_rgba(255,255,255,0.05)]"
                              : "text-white hover:bg-white/10 hover:shadow-sm",
                          )}
                          title={collapsed ? item.name : undefined}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-opacity",
                              isActive ? "text-[#0A47B1] opacity-100" : "text-white opacity-80",
                            )}
                          />
                          {!collapsed && <span>{item.name}</span>}
                        </Link>
                      )
                    })}
                  </div>
                )}

                {/* Divider between groups */}
                {!collapsed && groupIndex < navigationGroups.length - 1 && (
                  <div className="my-2 border-t border-white/10" />
                )}
              </div>
            )
          })}
        </nav>

        {/* Toggle button */}
        <div className="border-t border-white/10 p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full text-white hover:bg-white/10 hover:text-white transition-all duration-200",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile overlay - only show when sidebar is open on mobile */}
      {isMobile && !collapsed && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setCollapsed(true)} />
      )}
    </>
  )
}
