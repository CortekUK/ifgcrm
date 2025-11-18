import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, UserPlus, Mail, FileText, CheckCircle2 } from 'lucide-react'

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
    .limit(10)

  const demoActivities = [
    {
      id: "demo-1",
      type: "player_added",
      icon: UserPlus,
      color: "text-blue-600 bg-blue-100",
      title: "New player added",
      description: "John Mensah",
      time: "2 hours ago"
    },
    {
      id: "demo-2",
      type: "email_sent",
      icon: Mail,
      color: "text-green-600 bg-green-100",
      title: "Email sent",
      description: "Welcome to IFG",
      time: "3 hours ago"
    },
    {
      id: "demo-3",
      type: "invoice_reminder",
      icon: FileText,
      color: "text-orange-600 bg-orange-100",
      title: "Invoice reminder delivered",
      description: "Payment due in 7 days",
      time: "5 hours ago"
    },
    {
      id: "demo-4",
      type: "status_changed",
      icon: CheckCircle2,
      color: "text-purple-600 bg-purple-100",
      title: "Player status changed to Signed",
      description: "Sarah Owusu moved to Signed stage",
      time: "1 day ago"
    },
    {
      id: "demo-5",
      type: "player_added",
      icon: UserPlus,
      color: "text-blue-600 bg-blue-100",
      title: "New player added",
      description: "Michael Addo",
      time: "1 day ago"
    },
    {
      id: "demo-6",
      type: "email_sent",
      icon: Mail,
      color: "text-green-600 bg-green-100",
      title: "Email campaign sent",
      description: "Gap Year 2026-2027 - 156 recipients",
      time: "2 days ago"
    },
  ]

  const displayActivities = activities && activities.length > 0 ? activities : demoActivities

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
            <Clock className="h-4 w-4 text-primary" />
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
          <div className="relative space-y-4">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200" />
            
            {displayActivities.map((activity: any, index: number) => {
              const Icon = activity.icon || Activity
              return (
                <div key={activity.id} className="relative flex items-start gap-4 pl-2">
                  <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${activity.color || "bg-gray-100 text-gray-600"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1 pt-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">{activity.title || activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time || formatTime(activity.created_at)}</p>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description || activity.leads?.name}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
