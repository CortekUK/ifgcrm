import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

    const { data: player, error } = await supabase
      .from("leads")
      .select(`
        *,
        program:programs(id, name),
        recruiter:profiles(id, full_name)
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    // Format the response to match the expected structure
    const formattedPlayer = {
      id: player.id,
      name: player.name,
      email: player.email,
      phone: player.phone,
      programme: player.program?.name || "N/A",
      program_id: player.program_id,
      recruiter: player.recruiter?.full_name || "N/A",
      recruiter_id: player.user_id,
      status: player.status,
      notes: player.notes,
      last_activity: player.updated_at,
      created_at: player.created_at,
    }

    return NextResponse.json(formattedPlayer)
  } catch (error) {
    console.error("[v0] Error fetching player:", error)
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()
    const { name, email, phone, program_id, recruiter_id } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const updateData: any = {
      name,
      email,
      phone,
      updated_at: new Date().toISOString(),
    }

    if (program_id) {
      updateData.program_id = program_id
    }

    if (recruiter_id) {
      updateData.user_id = recruiter_id
    }

    const { data, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", params.id)
      .select(`
        *,
        program:programs(id, name),
        recruiter:profiles(id, full_name)
      `)
      .single()

    if (error) throw error

    // Format the response
    const formattedPlayer = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      programme: data.program?.name || "N/A",
      program_id: data.program_id,
      recruiter: data.recruiter?.full_name || "N/A",
      recruiter_id: data.user_id,
      status: data.status,
      notes: data.notes,
      last_activity: data.updated_at,
    }

    return NextResponse.json(formattedPlayer)
  } catch (error) {
    console.error("[v0] Error updating player:", error)
    return NextResponse.json({ error: "Failed to update player" }, { status: 500 })
  }
}
