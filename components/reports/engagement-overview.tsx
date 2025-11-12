"use client"

import { Card } from "@/components/ui/card"

export function EngagementOverview() {
  const dailySends = [
    { day: "Mon", count: 138 },
    { day: "Tue", count: 89 },
    { day: "Wed", count: 120 },
    { day: "Thu", count: 104 },
    { day: "Fri", count: 96 },
    { day: "Sat", count: 75 },
  ]

  const maxCount = Math.max(...dailySends.map((d) => d.count))

  return (
    <Card className="mb-6 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Engagement overview</h2>
        <p className="text-sm text-gray-600">Quick snapshot of recent email and SMS performance.</p>
      </div>

      {/* Top row: 3 mini stat blocks */}
      <div className="mb-6 grid grid-cols-3 gap-6">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Best performing campaign</p>
          <p className="text-lg font-bold text-gray-900">Summer Recruitment 2025</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Highest open rate</p>
          <p className="text-lg font-bold text-gray-900">67.8%</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Highest click rate</p>
          <p className="text-lg font-bold text-gray-900">28.9%</p>
        </div>
      </div>

      {/* Bottom row: bar chart showing Last 6 sends */}
      <div>
        <p className="mb-3 text-sm font-medium text-gray-700">Last 6 sends</p>
        <div className="flex items-end gap-4" style={{ height: "120px" }}>
          {dailySends.map((item) => {
            const heightPercent = (item.count / maxCount) * 100
            return (
              <div key={item.day} className="flex flex-1 flex-col items-center justify-end">
                <div className="mb-2 text-xs font-medium text-gray-700">{item.count}</div>
                <div
                  className="w-full rounded-t-md bg-gradient-to-br from-[#0A47B1] to-[#1739C0] transition-all hover:opacity-80"
                  style={{ height: `${heightPercent}%` }}
                />
                <div className="mt-2 text-xs font-medium text-gray-600">{item.day}</div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
