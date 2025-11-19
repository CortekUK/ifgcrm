import { NextRequest, NextResponse } from "next/server"

// Mock data for pipeline deal statistics
const mockStats = {
  "1": {
    active: 47,
    won: 23,
    lost: 8,
    totalValue: 125000,
    conversionRate: 74.2,
  },
  "2": {
    active: 35,
    won: 18,
    lost: 5,
    totalValue: 95000,
    conversionRate: 78.3,
  },
  "3": {
    active: 28,
    won: 15,
    lost: 10,
    totalValue: 80000,
    conversionRate: 60.0,
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Return mock statistics for the pipeline
  const stats = mockStats[id as keyof typeof mockStats] || {
    active: 47,
    won: 23,
    lost: 8,
    totalValue: 125000,
    conversionRate: 74.2,
  }

  // Add some randomization to make it more realistic for demo
  const variation = Math.random() * 0.1 - 0.05 // ±5% variation
  stats.active = Math.round(stats.active * (1 + variation))
  stats.won = Math.round(stats.won * (1 + variation))
  stats.lost = Math.round(stats.lost * (1 + variation))

  // Recalculate conversion rate based on won and lost
  const total = stats.won + stats.lost
  stats.conversionRate = total > 0 ? Math.round((stats.won / total) * 1000) / 10 : 0

  return NextResponse.json(stats)
}