import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Mock send payment link
  console.log(`[v0] Sending payment link for invoice ${id}`)

  return NextResponse.json({
    success: true,
    message: "Payment link sent successfully",
  })
}
