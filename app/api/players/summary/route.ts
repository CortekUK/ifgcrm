import { NextResponse } from "next/server"

export async function GET() {
  // Mock summary data - replace with real database query
  const summary = {
    total_players: 138,
    active_in_pipeline: 47,
    signed_players: 28,
  }

  return NextResponse.json(summary)
}
