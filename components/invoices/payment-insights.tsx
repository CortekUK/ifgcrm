"use client"

import { Card } from "@/components/ui/card"

export function PaymentInsights() {
  // Collections trend data - last 6 months
  const monthlyCollections = [
    { month: "Jun", value: 12000 },
    { month: "Jul", value: 14000 },
    { month: "Aug", value: 18000 },
    { month: "Sep", value: 16000 },
    { month: "Oct", value: 21000 },
    { month: "Nov", value: 23500 },
  ]

  const maxValue = Math.max(...monthlyCollections.map((m) => m.value))

  // Overdue breakdown data
  const statusData = [
    { label: "Paid", value: 68, color: "#2EB67D" },
    { label: "Sent", value: 18, color: "#0A47B1" },
    { label: "Draft", value: 8, color: "#9CA3AF" },
    { label: "Overdue", value: 6, color: "#E03E3E" },
  ]

  // Simple pie chart calculation
  const total = statusData.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <Card className="bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="mb-1 text-lg font-semibold text-gray-900">Payment Insights</h2>
        <p className="text-sm text-gray-600">Overview of recent payments and overdue trends.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Collections trend - Bar chart */}
        <div>
          <p className="mb-4 text-sm font-medium text-gray-700">Collections trend</p>
          <div className="flex items-end gap-3" style={{ height: "160px" }}>
            {monthlyCollections.map((item) => {
              const heightPercent = (item.value / maxValue) * 100
              return (
                <div key={item.month} className="flex flex-1 flex-col items-center justify-end">
                  <div className="mb-2 text-xs font-medium text-gray-700">{(item.value / 1000).toFixed(0)}k</div>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-br from-[#0A47B1] to-[#1739C0] transition-all hover:opacity-80"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="mt-2 text-xs font-medium text-gray-600">{item.month}</div>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-gray-500">Total collected per month (£)</p>
        </div>

        {/* Overdue breakdown - Doughnut chart */}
        <div>
          <p className="mb-4 text-sm font-medium text-gray-700">Overdue breakdown</p>
          <div className="flex flex-col items-center">
            {/* Simple doughnut visualization */}
            <div className="relative mb-4" style={{ width: "140px", height: "140px" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle cx="70" cy="70" r="60" fill="#F3F4F6" />
                {/* Status segments */}
                {statusData.map((status, index) => {
                  const percentage = (status.value / total) * 100
                  const angle = (percentage / 100) * 360
                  const startAngle = currentAngle
                  currentAngle += angle

                  const startRad = ((startAngle - 90) * Math.PI) / 180
                  const endRad = ((startAngle + angle - 90) * Math.PI) / 180

                  const x1 = 70 + 60 * Math.cos(startRad)
                  const y1 = 70 + 60 * Math.sin(startRad)
                  const x2 = 70 + 60 * Math.cos(endRad)
                  const y2 = 70 + 60 * Math.sin(endRad)

                  const largeArc = angle > 180 ? 1 : 0

                  return (
                    <path
                      key={status.label}
                      d={`M 70 70 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={status.color}
                      className="transition-opacity hover:opacity-80"
                    />
                  )
                })}
                {/* Inner white circle for doughnut effect */}
                <circle cx="70" cy="70" r="35" fill="white" />
              </svg>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {statusData.map((status) => (
                <div key={status.label} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: status.color }} />
                  <span className="text-xs text-gray-700">
                    {status.label} ({status.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
