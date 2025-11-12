import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const dealId = params.id

  // Mock: Move deal to next stage
  // In production, this would update the database
  return NextResponse.json({
    success: true,
    message: `Deal ${dealId} moved to next stage`,
  })
}
