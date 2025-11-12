import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - replace with real database queries
  const summary = {
    total_campaigns: 24,
    emails_sent: 1847,
    sms_sent: 623,
    avg_response_rate: 38.5,
  }

  return NextResponse.json(summary)
}
