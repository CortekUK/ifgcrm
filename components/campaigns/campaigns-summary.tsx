"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Send, Mail, MessageSquare, TrendingUp } from "lucide-react"

interface Summary {
  total_campaigns: number
  emails_sent: number
  sms_sent: number
  avg_response_rate: number
}

export function CampaignsSummary() {
  const [summary, setSummary] = useState<Summary>({
    total_campaigns: 0,
    emails_sent: 0,
    sms_sent: 0,
    avg_response_rate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/campaigns/summary")
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error("Failed to fetch summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: "Total Campaigns",
      value: summary.total_campaigns,
      icon: Send,
      trend: "+4 from last week",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Emails Sent",
      value: summary.emails_sent.toLocaleString(),
      icon: Mail,
      trend: "+234 this week",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "SMS Sent",
      value: summary.sms_sent.toLocaleString(),
      icon: MessageSquare,
      trend: "+89 this week",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg. Response Rate",
      value: `${summary.avg_response_rate}%`,
      icon: TrendingUp,
      trend: "+2.3% from last month",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  if (loading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse bg-white p-4">
            <div className="h-12 rounded bg-gray-200"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="card-fade-in cursor-pointer bg-white shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
            style={{ animationDelay: `${index * 80}ms`, padding: "22px 20px" }}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="mb-1 text-sm text-gray-600" style={{ fontFamily: "Inter", fontWeight: 400 }}>
                  {stat.label}
                </p>
                <p className="text-3xl text-gray-900" style={{ fontFamily: "Oswald", fontWeight: 500 }}>
                  {stat.value}
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ fontFamily: "Inter", fontWeight: 400, color: "#6B7280" }}>
              {stat.trend}
            </p>
          </Card>
        ))}
      </div>
    </>
  )
}
