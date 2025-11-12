"use client"

import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, MousePointer, Eye } from "lucide-react"

export function ReportsSummary() {
  const stats = [
    {
      label: "Total Emails Sent",
      value: "1,847",
      subtext: "vs last month +12%",
      trend: "positive",
      icon: Mail,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "SMS Sent",
      value: "623",
      subtext: "vs last month +5%",
      trend: "positive",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg. Open Rate",
      value: "42.6%",
      subtext: "Email",
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Avg. Click Rate",
      value: "18.3%",
      subtext: "Email",
      icon: MousePointer,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={stat.label} className="bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="mb-3 flex items-start justify-between">
            <div className={`rounded-lg p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-right">
              <p className="mb-1 text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <p className={`text-xs ${stat.trend === "positive" ? "text-green-600" : "text-gray-600"}`}>{stat.subtext}</p>
        </Card>
      ))}
    </div>
  )
}
