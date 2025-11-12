"use client"

import { createClient } from "@/lib/supabase/client"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Search, Bell, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

interface AppHeaderProps {
  user: User
  title: string
}

interface Activity {
  id: string
  type: string
  description: string
  created_at: string
}

interface Lead {
  id: string
  name: string
  email: string
  status: string
}

interface Program {
  id: string
  name: string
  description: string
}

interface SearchResults {
  leads: Lead[]
  programs: Program[]
  activities: Activity[]
}

export function AppHeader({ user, title }: AppHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Activity[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResults>({
    leads: [],
    programs: [],
    activities: [],
  })
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        console.log("[v0] User not available yet, skipping notifications fetch")
        return
      }

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("[v0] Error fetching notifications:", error)
        return
      }

      if (data) {
        setNotifications(data)
        setUnreadCount(data.length > 0 ? Math.min(data.length, 9) : 0)
      }
    }

    fetchNotifications()
  }, [user?.id, supabase])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults({ leads: [], programs: [], activities: [] })
        return
      }

      if (!user?.id) {
        console.log("[v0] User not available yet, skipping search")
        return
      }

      setIsSearching(true)

      try {
        const searchTerm = `%${searchQuery}%`

        const [leadsRes, programsRes, activitiesRes] = await Promise.all([
          supabase
            .from("leads")
            .select("id, name, email, status")
            .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from("programs")
            .select("id, name, description")
            .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .limit(5),
          supabase
            .from("activities")
            .select("id, type, description, created_at")
            .eq("user_id", user.id)
            .or(`type.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .limit(5),
        ])

        setSearchResults({
          leads: leadsRes.data || [],
          programs: programsRes.data || [],
          activities: activitiesRes.data || [],
        })
      } catch (error) {
        console.error("[v0] Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounce = setTimeout(performSearch, 300)
    return () => clearTimeout(debounce)
  }, [searchQuery, supabase, user?.id])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const handleClearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const handleLeadClick = (leadId: string) => {
    router.push(`/players/${leadId}`)
    setSearchOpen(false)
    setSearchQuery("")
  }

  const handleProgramClick = (programId: string) => {
    router.push(`/programmes?id=${programId}`)
    setSearchOpen(false)
    setSearchQuery("")
  }

  const totalResults = searchResults.leads.length + searchResults.programs.length + searchResults.activities.length

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <header
        className="sticky top-0 z-30 bg-background border-b-2 border-primary"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div>
            <h1
              className="text-2xl tracking-tight text-foreground uppercase"
              style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, letterSpacing: "0.5px" }}
            >
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-primary" />
              <button
                onClick={() => setSearchOpen(true)}
                className="w-64 h-10 pl-9 pr-3 bg-background text-foreground border border-border rounded-lg text-left text-sm placeholder:text-muted-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <span className="text-muted-foreground">Search...</span>
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary/10 transition-all duration-200 text-primary"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      onClick={handleClearNotifications}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                      >
                        <div className="flex w-full items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground leading-tight">{notification.type}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{notification.description}</p>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-primary/10 transition-all duration-200 text-primary"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground shadow-md bg-primary">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden text-sm font-medium md:inline-block">{user?.email || "Loading..."}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user?.email || "Loading..."}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players, programmes, activities..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
              autoFocus
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto p-2">
            {!searchQuery || searchQuery.length < 2 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Type to search across players, programmes, and activities
              </div>
            ) : isSearching ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Searching...</div>
            ) : totalResults === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.leads.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Players ({searchResults.leads.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.leads.map((lead) => (
                        <button
                          key={lead.id}
                          onClick={() => handleLeadClick(lead.id)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-left group transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">{lead.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor:
                                  lead.status === "hot"
                                    ? "hsl(var(--destructive) / 0.1)"
                                    : lead.status === "warm"
                                      ? "hsl(var(--warning) / 0.1)"
                                      : "hsl(var(--primary) / 0.1)",
                                color:
                                  lead.status === "hot"
                                    ? "hsl(var(--destructive))"
                                    : lead.status === "warm"
                                      ? "hsl(var(--warning))"
                                      : "hsl(var(--primary))",
                              }}
                            >
                              {lead.status}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.programs.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Programmes ({searchResults.programs.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.programs.map((program) => (
                        <button
                          key={program.id}
                          onClick={() => handleProgramClick(program.id)}
                          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-left group transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground">{program.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{program.description}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.activities.length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Recent Activity ({searchResults.activities.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.activities.map((activity) => (
                        <div key={activity.id} className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-foreground">{activity.type}</div>
                              <div className="text-xs text-muted-foreground">{activity.description}</div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(activity.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
