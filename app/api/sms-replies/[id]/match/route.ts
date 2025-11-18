import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: smsMessage, error: fetchError } = await supabase
      .from("sms_messages")
      .select("message, phone_number")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError) throw fetchError
    if (!smsMessage) {
      return NextResponse.json({ error: "SMS reply not found" }, { status: 404 })
    }

    const { data: updatedMessage, error: updateError } = await supabase
      .from("sms_messages")
      .update({
        status: "matched",
        lead_id: playerId,
        matched_at: new Date().toISOString(),
        matched_by_user_id: user.id,
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (updateError) throw updateError

    const truncatedMessage = smsMessage.message.length > 50 
      ? smsMessage.message.substring(0, 50) + "..." 
      : smsMessage.message

    const { error: activityError } = await supabase
      .from("activities")
      .insert({
        type: "sms_reply",
        description: `Inbound SMS: ${truncatedMessage}`,
        lead_id: playerId,
        metadata: {
          smsReplyId: params.id,
          phoneNumber: smsMessage.phone_number,
        },
        user_id: user.id,
      })

    if (activityError) {
      console.error("[v0] Error creating activity:", activityError)
      // Don't fail the request if activity creation fails
    }

    return NextResponse.json(updatedMessage)
  } catch (error: any) {
    console.error("[v0] Error matching SMS reply:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
