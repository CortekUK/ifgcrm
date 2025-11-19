"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, Users, Clock, TrendingUp } from "lucide-react"

export function PlayerGroupsSummary() {
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalPlayers: 0,
    recentlyUpdated: 0,
    activeGroups: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/player-groups")
      const data = await response.json()

      // Calculate stats from groups data
      const groups = data.data
      const uniquePlayers = new Set()
      let recentCount = 0
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      groups.forEach((group: any) => {
        group.playerIds.forEach((id: number) => uniquePlayers.add(id))
        if (new Date(group.updatedAt) > oneWeekAgo) {
          recentCount++
        }
      })

      setStats({
        totalGroups: groups.length,
        totalPlayers: uniquePlayers.size,
        recentlyUpdated: recentCount,
        activeGroups: groups.filter((g: any) => g.playerIds.length > 0).length,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGroups}</div>
          <p className="text-xs text-muted-foreground">Custom player groups</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPlayers}</div>
          <p className="text-xs text-muted-foreground">Unique players in groups</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recently Updated</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.recentlyUpdated}</div>
          <p className="text-xs text-muted-foreground">Updated this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeGroups}</div>
          <p className="text-xs text-muted-foreground">Groups with players</p>
        </CardContent>
      </Card>
    </div>
  )
}