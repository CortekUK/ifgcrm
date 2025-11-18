"use client"
import { useState } from "react"

interface Deal {
  id: number
  player_name: string
  programme: string
  recruiter: string
  last_activity: string
  deal_value: number
}

interface DealCardProps {
  deal: Deal
  stageName: string
  onClick: () => void
  onDragStart: () => void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const STAGE_BORDER_MAP: Record<string, string> = {
  "Initial Lead": "border-l-blue-400",
  "Zoom Scheduled": "border-l-amber-400",
  "Zoom Completed": "border-l-purple-400",
  "Application Sent": "border-l-emerald-400",
  Accepted: "border-l-gray-400",
}

export function DealCard({ deal, stageName, onClick, onDragStart }: DealCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const stageBorder = STAGE_BORDER_MAP[stageName] || "border-l-gray-400"

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("dealId", deal.id.toString())
    onDragStart()
    setIsDragging(true)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />

      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={() => setIsDragging(false)}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 ${stageBorder} border-l-4 ${
          isDragging
            ? "scale-105 opacity-50 shadow-lg"
            : isHovered
              ? "shadow-md border-[#0A47B1] bg-[#F8FAFF]"
              : "border-[#E6E8F0]"
        }`}
        style={{
          borderRadius: "12px",
        }}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-xs font-semibold text-white">
              {getInitials(deal.player_name)}
            </div>
            <div>
              <h4
                className="font-semibold"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#0A0A0A",
                }}
              >
                {deal.player_name}
              </h4>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div
            className="font-semibold"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              color: "#00A35C",
              fontSize: "14px",
            }}
          >
            £{deal.deal_value.toLocaleString()}
          </div>
        </div>

        <div className="mb-2 inline-block rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {deal.programme}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
              {getInitials(deal.recruiter)}
            </div>
            <span>{deal.recruiter}</span>
          </div>
          <div className="text-gray-400">{deal.last_activity}</div>
        </div>
      </div>
      {/* End of deal card content */}
    </>
  )
}
