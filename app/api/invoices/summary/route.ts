import { NextResponse } from "next/server"

export async function GET() {
  // Mock summary data
  const summary = {
    outstanding_balance: 45750,
    overdue_count: 8,
    paid_this_month: 23500,
    currency: "GBP",
  }

  return NextResponse.json(summary)
}
