import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(request: Request, { params }: { params: { id: string; stageId: string } }) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the stage
    const { error } = await supabase.from("stages").delete().eq("id", params.stageId).eq("pipeline_id", params.id)

    if (error) {
      console.error("Error deleting stage:", error)
      return NextResponse.json({ error: "Failed to delete stage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete stage route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string; stageId: string } }) {
  try {
    const supabase = await createServerClient()
    const { name, color, order } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the stage
    const { error } = await supabase
      .from("stages")
      .update({ name, color, order })
      .eq("id", params.stageId)
      .eq("pipeline_id", params.id)

    if (error) {
      console.error("Error updating stage:", error)
      return NextResponse.json({ error: "Failed to update stage" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in update stage route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
