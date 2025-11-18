import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: { id: string; stageId: string } }) {
  try {
    const supabase = await createServerClient()
    const { toStageId } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Move all deals from the source stage to the target stage
    const { error } = await supabase.from("deals").update({ stage_id: toStageId }).eq("stage_id", params.stageId)

    if (error) {
      console.error("Error moving deals:", error)
      return NextResponse.json({ error: "Failed to move deals" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in move-deals route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
