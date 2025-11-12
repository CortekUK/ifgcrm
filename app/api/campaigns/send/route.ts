import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Mock sending a campaign
  console.log("Sending campaign:", body)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    success: true,
    message: `Campaign sent to ${body.recipients === "all" ? "all players" : body.recipients}`,
  })
}
