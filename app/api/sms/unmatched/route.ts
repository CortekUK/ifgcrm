import { NextResponse } from "next/server"

export async function GET() {
  // Mock data for unmatched SMS replies
  const unmatchedReplies = [
    {
      id: "1",
      from: "John Smith",
      phone: "+1 555-0123",
      message: "Thanks for the info! When does the next program start?",
      receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    },
    {
      id: "2",
      from: "Emma Wilson",
      phone: "+1 555-0124",
      message: "I'm interested in the elite training program",
      receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    },
    {
      id: "3",
      from: "Michael Chen",
      phone: "+1 555-0125",
      message: "Can I get more details about the costs?",
      receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8h ago
    },
  ]

  return NextResponse.json(unmatchedReplies)
}
