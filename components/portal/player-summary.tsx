"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PlayerData {
  name: string
  programme: string
  recruiter_name?: string
  recruiter_email?: string
  status: string
}

export function PlayerSummary() {
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setPlayer(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    )
  }

  if (!player) return null

  const statusColor = player.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Player summary</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{player.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Programme</p>
          <p className="font-medium text-gray-900">{player.programme}</p>
        </div>
        {player.recruiter_name && (
          <div>
            <p className="text-sm text-gray-500">Recruiter</p>
            <p className="font-medium text-gray-900">{player.recruiter_name}</p>
            {player.recruiter_email && (
              <a href={`mailto:${player.recruiter_email}`} className="text-sm text-blue-600 hover:underline">
                {player.recruiter_email}
              </a>
            )}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>
            {player.status}
          </span>
        </div>
      </div>
    </Card>
  )
}
