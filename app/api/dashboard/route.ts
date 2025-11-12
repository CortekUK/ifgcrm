import { NextResponse } from "next/server"

export async function GET() {
  // Mock dashboard data
  const dashboardData = {
    stats: {
      totalLeads: 156,
      unmatchedReplies: 8,
      activePrograms: 4,
      todayActivity: 23,
    },
    recentActivity: [
      {
        id: "1",
        playerName: "Alex Johnson",
        action: "New lead created",
        time: "2h ago",
        type: "lead_created",
      },
      {
        id: "2",
        playerName: "Sarah Miller",
        action: "SMS campaign sent",
        time: "3h ago",
        type: "sms_sent",
      },
      {
        id: "3",
        playerName: "David Brown",
        action: "Invoice paid",
        time: "5h ago",
        type: "payment_received",
      },
      {
        id: "4",
        playerName: "Emily Davis",
        action: "Program enrolled",
        time: "6h ago",
        type: "program_enrolled",
      },
      {
        id: "5",
        playerName: "James Wilson",
        action: "Document uploaded",
        time: "8h ago",
        type: "document_uploaded",
      },
    ],
  }

  return NextResponse.json(dashboardData)
}
