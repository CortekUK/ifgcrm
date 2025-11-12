import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || "all"
  const status = searchParams.get("status") || "all"

  // Mock campaigns data
  const allCampaigns = [
    {
      id: "1",
      name: "Summer Recruitment 2025",
      type: "email",
      status: "sent",
      sent: 138,
      open_rate: 45.2,
      click_rate: 23.1,
      last_sent: "2025-01-05T10:00:00Z",
      thumbnail: "/email-campaign-recruitment.jpg",
      created_at: "2025-01-05T10:00:00Z",
    },
    {
      id: "2",
      name: "Trial Invitation - Week 2",
      type: "sms",
      status: "sent",
      sent: 89,
      open_rate: 0,
      click_rate: 67.4,
      last_sent: "2025-01-07T14:30:00Z",
      created_at: "2025-01-07T14:30:00Z",
    },
    {
      id: "3",
      name: "Follow-up: Elite Programme",
      type: "email",
      status: "scheduled",
      sent: 0,
      open_rate: 0,
      click_rate: 0,
      last_sent: "2025-01-10T09:00:00Z",
      thumbnail: "/elite-football-program.jpg",
      created_at: "2025-01-08T09:00:00Z",
    },
    {
      id: "4",
      name: "Welcome Message - New Players",
      type: "email",
      status: "draft",
      sent: 0,
      open_rate: 0,
      click_rate: 0,
      last_sent: "2025-01-08T16:00:00Z",
      thumbnail: "/welcome-message-football.jpg",
      created_at: "2025-01-08T16:00:00Z",
    },
  ]

  let filtered = allCampaigns

  if (search) {
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  }

  if (type !== "all") {
    filtered = filtered.filter((c) => c.type === type)
  }

  if (status !== "all") {
    filtered = filtered.filter((c) => c.status === status)
  }

  return NextResponse.json({ data: filtered, total: filtered.length })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Mock creating a campaign
  console.log("Creating campaign:", body)

  return NextResponse.json({ success: true, id: "new-campaign-id" })
}
