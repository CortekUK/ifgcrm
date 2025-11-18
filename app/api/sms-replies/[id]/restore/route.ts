import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Restore to unmatched status and clear matching fields
    const { data, error } = await supabase
      .from("sms_messages")
      .update({
        status: "unmatched",
        lead_id: null,
        matched_at: null,
        matched_by_user_id: null,
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error restoring SMS reply:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
