import { NextRequest, NextResponse } from "next/server"

// Mock data for single campaign
const campaignData = {
  id: "1",
  name: "Spring Showcase Event Invitation",
  type: "email",
  status: "sent",
  sent: 138,
  open_rate: 58,
  click_rate: 24,
  response_rate: 18,
  bounce_rate: 2.1,
  created_at: "2024-01-15T10:00:00Z",
  last_sent: "2024-01-16T14:30:00Z",
  thumbnail: "/placeholder.svg",
  subject: "You're Invited: IFG Showcase Event",
  content: `Hi [Player Name],

We're excited to invite you to our upcoming showcase event where you'll have the opportunity to demonstrate your skills and meet with our coaching staff.

Event Details:
- Date: Saturday, March 15th, 2024
- Time: 10:00 AM - 2:00 PM
- Location: IFG Training Center

Please RSVP by clicking the link below.

Best regards,
IFG Academy Team`,
  lists: [
    { id: "1", name: "Oxford University List", recipients: 45 },
    { id: "2", name: "Cambridge University List", recipients: 38 },
    { id: "3", name: "London Universities List", recipients: 32 },
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // For demo purposes, return the same campaign data with the requested ID
  const campaign = {
    ...campaignData,
    id: id,
  }

  // Simulate different statuses for different IDs
  if (id === "2") {
    campaign.status = "draft"
    campaign.name = "Summer Training Camp Announcement"
  } else if (id === "3") {
    campaign.status = "scheduled"
    campaign.name = "Player Registration Reminder"
  } else if (id === "4") {
    campaign.status = "paused"
    campaign.name = "Tournament Invitation"
  }

  // Add some delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 300))

  return NextResponse.json(campaign)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  // In a real app, this would update the campaign in the database
  console.log("Updating campaign:", id, body)

  return NextResponse.json({
    success: true,
    message: "Campaign updated successfully",
    data: { ...campaignData, ...body, id }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // In a real app, this would delete the campaign from the database
  console.log("Deleting campaign:", id)

  return NextResponse.json({
    success: true,
    message: "Campaign deleted successfully"
  })
}