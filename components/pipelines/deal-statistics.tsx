"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Trophy, XCircle, Activity } from "lucide-react"
import { useEffect, useState } from "react"

interface DealStats {
  active: number
  won: number
  lost: number
  totalValue: number
  conversionRate: number
}

interface DealStatisticsProps {
  pipelineId?: string
}

export function DealStatistics({ pipelineId }: DealStatisticsProps) {
  const [stats, setStats] = useState<DealStats>({
    active: 0,
    won: 0,
    lost: 0,
    totalValue: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    if (pipelineId) {
      // Fetch stats for specific pipeline
      fetchStats(pipelineId)
    }
  }, [pipelineId])

  const fetchStats = async (id: string) => {
    try {
      const response = await fetch(`/api/pipelines/${id}/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch deal statistics:", error)
      // Use mock data for demo
      setStats({
        active: 47,
        won: 23,
        lost: 8,
        totalValue: 125000,
        conversionRate: 74.2,
      })
    }
  }

  const statCards = [
    {
      title: "Active Deals",
      value: stats.active,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Currently in pipeline",
    },
    {
      title: "Won Deals",
      value: stats.won,
      icon: Trophy,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Successfully closed",
    },
    {
      title: "Lost Deals",
      value: stats.lost,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Not converted",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Win rate",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`relative overflow-hidden border-2 ${stat.borderColor} transition-all duration-200 hover:shadow-lg`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>

              {/* Optional: Add a subtle background pattern */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} opacity-10 rounded-full -mr-16 -mt-16`}
              />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}