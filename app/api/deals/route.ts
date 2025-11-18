import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { player_id, player_name, pipeline_id, stage_id, recruiter_id, value, notes } = body

    if (!player_name || !pipeline_id) {
      return NextResponse.json({ error: "Player name and pipeline are required" }, { status: 400 })
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let finalPlayerId = player_id

    if (!finalPlayerId) {
      // Create a new lead/player in the database
      const { data: newPlayer, error: playerError } = await supabase
        .from("leads")
        .insert({
          name: player_name,
          email: `${player_name.toLowerCase().replace(/\s+/g, ".")}@temp.com`,
          phone: "",
          status: "In Pipeline",
          notes: notes || "",
          program_id: pipeline_id,
          user_id: user.id,
        })
        .select()
        .single()

      if (playerError) {
        console.error("[v0] Error creating player:", playerError)
        return NextResponse.json({ error: "Failed to create player" }, { status: 500 })
      }

      finalPlayerId = newPlayer.id
    }

    const { data: programme } = await supabase.from("programs").select("name").eq("id", pipeline_id).single()

    const { data: recruiter } = recruiter_id
      ? await supabase.from("profiles").select("full_name").eq("id", recruiter_id).single()
      : { data: null }

    const { data: player } = await supabase.from("leads").select("name, email, phone").eq("id", finalPlayerId).single()

    const newDeal = {
      id: finalPlayerId,
      player_name: player?.name || player_name,
      email: player?.email || "",
      phone: player?.phone || "",
      programme: programme?.name || "",
      programme_id: pipeline_id,
      stage_id: stage_id || null,
      recruiter: recruiter?.full_name || "",
      recruiter_id: recruiter_id || null,
      status: "In Pipeline",
      last_activity: new Date().toISOString(),
      deal_value: value || 0,
      notes: notes || "",
    }

    console.log("[v0] Created new deal:", newDeal)

    return NextResponse.json(newDeal, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating deal:", error)
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
  }
}
