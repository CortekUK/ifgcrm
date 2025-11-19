import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Users, MessageSquare, Mail, FileText, ArrowDownToLine } from 'lucide-react'

export async function StatsCards() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch stats
  const [{ count: totalLeads }, { count: unmatchedReplies }, { count: activePrograms }, { count: todayActivities }] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("sms_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_matched", false),
      supabase.from("programs").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("activities")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", new Date().toISOString().split("T")[0]),
    ])

  const stats = [
    {
      label: "SMS Inflows",
      value: 72,
      trend: 18,
      trendDirection: "up" as const,
      icon: MessageSquare,
      color: "text-green-600 bg-green-50",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      sparklineData: [48, 52, 58, 65, 68, 70, 72],
    },
    {
      label: "Email Inflows",
      value: 58,
      trend: 12,
      trendDirection: "up" as const,
      icon: Mail,
      color: "text-blue-600 bg-blue-50",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      sparklineData: [42, 45, 48, 52, 54, 56, 58],
    },
    {
      label: "Form Submissions",
      value: 36,
      trend: 8,
      trendDirection: "up" as const,
      icon: FileText,
      color: "text-amber-600 bg-amber-50",
      gradientFrom: "from-amber-500",
      gradientTo: "to-amber-600",
      sparklineData: [28, 30, 32, 33, 34, 35, 36],
    },
    {
      label: "Direct CRM",
      value: 21,
      trend: 5,
      trendDirection: "down" as const,
      icon: ArrowDownToLine,
      color: "text-purple-600 bg-purple-50",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
      sparklineData: [24, 23, 23, 22, 22, 21, 21],
    },
  ]

  const getTrendIcon = (direction: string) => {
    if (direction === "up") return <TrendingUp className="h-3 w-3" />
    if (direction === "down") return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getTrendColor = (direction: string) => {
    if (direction === "up") return "text-success"
    if (direction === "down") return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const max = Math.max(...stat.sparklineData)
          const min = Math.min(...stat.sparklineData)
          const range = max - min || 1

          return (
            <Card
              key={stat.label}
              className="card-fade-in overflow-hidden rounded-[14px] border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-16 bg-gradient-to-b from-muted/50 to-background" />
              <CardContent className="p-6 pt-0 -mt-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p
                      className="text-xs uppercase tracking-wide py-0.5 text-primary"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.7px",
                      }}
                    >
                      {stat.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
                    <div
                      className={`mt-3 flex items-center gap-1 text-xs font-bold ${getTrendColor(stat.trendDirection)}`}
                    >
                      {getTrendIcon(stat.trendDirection)}
                      <span>{stat.trend}% vs last week</span>
                    </div>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex h-8 items-end justify-between gap-0.5">
                  {stat.sparklineData.map((value, i) => {
                    const height = ((value - min) / range) * 100
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-t bg-gradient-to-t ${stat.gradientFrom} ${stat.gradientTo} opacity-40 transition-all duration-300 hover:opacity-70`}
                        style={{ height: `${height}%`, minHeight: "8%" }}
                      />
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
