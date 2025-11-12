import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  console.log("[v0] Updating deal:", id, "with data:", body)

  // Mock successful update
  return NextResponse.json({
    success: true,
    message: "Deal updated successfully",
    dealId: id,
    newStageId: body.stage_id,
  })
}
