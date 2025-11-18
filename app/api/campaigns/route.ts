import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || "all"
  const status = searchParams.get("status") || "all"

  const allCampaigns = [
    {
      id: "1",
      name: "Gap Year 2026-2027",
      type: "email",
      status: "sent",
      sent: 156,
      open_rate: 52.8,
      click_rate: 28.4,
      last_sent: "2025-01-05T10:00:00Z",
      thumbnail: "/email-campaign-recruitment.jpg",
      created_at: "2025-01-05T10:00:00Z",
    },
    {
      id: "2",
      name: "Pre-Season Training Camp Invites",
      type: "email",
      status: "scheduled",
      sent: 0,
      open_rate: 0,
      click_rate: 0,
      last_sent: "2025-01-15T09:00:00Z",
      thumbnail: "/elite-football-program.jpg",
      created_at: "2025-01-08T09:00:00Z",
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
