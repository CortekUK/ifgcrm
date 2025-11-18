import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, phone, email } = await request.json()

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create new player
    const { data: newPlayer, error: createError } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        email: email || null,
        status: "New",
        user_id: user.id,
      })
      .select()
      .single()

    if (createError) throw createError

    // Update the SMS message to mark it as matched
    const { error: updateError } = await supabase
      .from("sms_messages")
      .update({
        is_matched: true,
        lead_id: newPlayer.id,
      })
      .eq("id", params.id)
      .eq("user_id", user.id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true, player: newPlayer })
  } catch (error: any) {
    console.error("[v0] Error creating player from SMS reply:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
