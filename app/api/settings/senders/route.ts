import { NextResponse } from "next/server"

export async function GET() {
  // Mock email sender identities
  const mockSenders = [
    {
      id: 1,
      displayName: "Nathan Bibby",
      fromEmail: "nathan@macclesfieldfc.com",
      verified: true,
      isDefault: true,
    },
    {
      id: 2,
      displayName: "Sarah Williams",
      fromEmail: "sarah@internationalfootballgroup.com",
      verified: true,
      isDefault: false,
    },
    {
      id: 3,
      displayName: "Chris Thompson",
      fromEmail: "chris@macclesfieldfc.com",
      verified: false,
      isDefault: false,
    },
  ]

  return NextResponse.json(mockSenders)
}

export async function POST(request: Request) {
  const body = await request.json()

  // Mock creating a sender identity
  const newSender = {
    id: Date.now(),
    displayName: body.displayName,
    fromEmail: body.fromEmail,
    verified: false, // New senders start unverified
    isDefault: body.isDefault,
  }

  return NextResponse.json(newSender, { status: 201 })
}
