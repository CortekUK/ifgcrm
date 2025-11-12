import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"

export async function RecentActivity() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: activities } = await supabase
    .from("activities")
    .select(`
      *,
      leads (name)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "lead_created":
        return "bg-blue-100 text-blue-700"
      case "sms_sent":
        return "bg-green-100 text-green-700"
      case "program_created":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead_created":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case "sms_sent":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        )
      case "program_created":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )
    }
  }

  const formatTime = (date: string) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <CardTitle
              className="text-sm uppercase tracking-wide py-0.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.7px",
                color: "#0A47B1",
              }}
            >
              Recent Activity
            </CardTitle>
          </div>
          <CardDescription>Latest updates from your CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="btn-press flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${getActivityColor(activity.type)}`}
                  >
                    {activity.leads?.name ? getInitials(activity.leads.name) : "??"}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">{activity.leads?.name || "Unknown Player"}</p>
                      <p className="text-xs text-gray-500">{formatTime(activity.created_at)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gray-100">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900">No recent activity</p>
                <p className="mt-1 text-xs text-gray-500">Activity will appear here as you use the CRM</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
