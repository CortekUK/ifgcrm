import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listId, contactIds } = body

    console.log("[v0] Removing contacts from list:", listId, contactIds)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error removing contacts from list:", error)
    return NextResponse.json({ error: "Failed to remove contacts" }, { status: 500 })
  }
}
