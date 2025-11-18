import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const supabase = await createServerClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Build update object
    const updateData: any = {}

    if (body.name) updateData.name = body.name
    if (body.email) updateData.email = body.email
    if (body.phone) updateData.phone = body.phone
    if (body.program_id) updateData.program_id = body.program_id
    if (body.stage_id) updateData.status = `stage_${body.stage_id}` // Map stage to status field
    if (body.next_follow_up) updateData.notes = body.next_follow_up // Store in notes or add a follow_up_date column
    if (body.recruiter_id) updateData.user_id = body.recruiter_id

    updateData.updated_at = new Date().toISOString()

    // Update the lead
    const { data, error } = await supabase.from("leads").update(updateData).eq("id", id).eq("user_id", user.id).select()

    if (error) {
      console.error("[v0] Error updating deal:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Deal updated successfully",
      data: data?.[0],
    })
  } catch (error) {
    console.error("[v0] Error updating deal:", error)
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 })
  }
}
