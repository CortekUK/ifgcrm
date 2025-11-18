"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Puzzle, CheckCircle2 } from "lucide-react"

interface Summary {
  total_players: number
  active_in_pipeline: number
  signed_players: number
}

export function PlayersSummary() {
  const [summary, setSummary] = useState<Summary>({
    total_players: 0,
    active_in_pipeline: 0,
    signed_players: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/players/summary")
      const data = await response.json()
      setSummary({
        total_players: data.total_players ?? 0,
        active_in_pipeline: data.active_in_pipeline ?? 0,
        signed_players: data.signed_players ?? 0,
      })
    } catch (error) {
      console.error("Failed to fetch summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: "Total Players",
      value: summary.total_players,
      icon: Users,
      trend: "+3 new this week",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "In Pipeline",
      value: summary.active_in_pipeline,
      icon: Puzzle,
      trend: "5 active deals",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Signed",
      value: summary.signed_players,
      icon: CheckCircle2,
      trend: "+2 this month",
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 bg-white animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap" rel="stylesheet" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            className="bg-white hover:scale-[1.02] transition-transform duration-200 cursor-pointer card-fade-in"
            style={{
              animationDelay: `${index * 80}ms`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              padding: "24px 20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p
                  className="text-sm text-gray-600 mb-1"
                  style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, letterSpacing: "0.7px" }}
                >
                  {stat.label}
                </p>
                <p className="font-semibold" style={{ fontSize: "28px", fontWeight: 600, color: "#0A0A0A" }}>
                  {(stat.value ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
