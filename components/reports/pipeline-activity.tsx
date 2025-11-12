"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function PipelineActivity() {
  const activities = [
    {
      player: "James Wilson",
      fromStage: "Initial Lead",
      toStage: "In Contact",
      recruiter: "Sarah Mitchell",
      date: "2 hours ago",
    },
    {
      player: "Emma Rodriguez",
      fromStage: "Zoom Scheduled",
      toStage: "Follow Up",
      recruiter: "Mike Johnson",
      date: "5 hours ago",
    },
    {
      player: "Lucas Brown",
      fromStage: "In Contact",
      toStage: "Zoom Scheduled",
      recruiter: "Chris Anderson",
      date: "1 day ago",
    },
    {
      player: "Sophia Chen",
      fromStage: "Follow Up",
      toStage: "Collecting Documents",
      recruiter: "Emma Davis",
      date: "1 day ago",
    },
    {
      player: "Noah Anderson",
      fromStage: "Collecting Documents",
      toStage: "Applied",
      recruiter: "Sarah Mitchell",
      date: "2 days ago",
    },
  ]

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      "Initial Lead": "bg-teal-100 text-teal-700",
      "In Contact": "bg-sky-100 text-sky-700",
      "Zoom Scheduled": "bg-purple-100 text-purple-700",
      "Follow Up": "bg-yellow-100 text-yellow-700",
      "Collecting Documents": "bg-orange-100 text-orange-700",
      Applied: "bg-pink-100 text-pink-700",
    }
    return colors[stage] || "bg-gray-100 text-gray-700"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <Card className="bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Pipeline activity</h2>
        <p className="text-sm text-gray-600">Recent movements across recruitment stages.</p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Player</TableHead>
              <TableHead className="font-semibold text-gray-700">From stage</TableHead>
              <TableHead className="font-semibold text-gray-700">To stage</TableHead>
              <TableHead className="font-semibold text-gray-700">Recruiter</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{activity.player}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStageColor(activity.fromStage)}>
                    {activity.fromStage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStageColor(activity.toStage)}>
                    {activity.toStage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-100 text-xs text-blue-700">
                        {getInitials(activity.recruiter)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700">{activity.recruiter}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
