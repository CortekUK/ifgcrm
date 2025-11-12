import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock activity data
  const mockActivity = [
    {
      id: 1,
      action: "Email sent",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Welcome email sent to player",
    },
    {
      id: 2,
      action: "Profile updated",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Programme assignment changed",
    },
    {
      id: 3,
      action: "Document uploaded",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Player contract uploaded by recruiter",
    },
    {
      id: 4,
      action: "Status changed",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      description: "Status changed to 'In pipeline'",
    },
  ]

  return NextResponse.json(mockActivity)
}
