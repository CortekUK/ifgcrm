import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { playerIds } = body

    // Validate playerIds
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return NextResponse.json(
        { error: "playerIds must be a non-empty array" },
        { status: 400 }
      )
    }

    // Verify list exists
    const { data: list, error: listError } = await supabase
      .from("lists")
      .select("id")
      .eq("id", id)
      .single()

    if (listError) {
      if (listError.code === "PGRST116") {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        )
      }
      throw listError
    }

    // Verify all players exist
    const { data: existingPlayers, error: playersError } = await supabase
      .from("leads")
      .select("id")
      .in("id", playerIds)

    if (playersError) {
      throw playersError
    }

    const existingPlayerIds = existingPlayers?.map(p => p.id) || []
    const invalidPlayerIds = playerIds.filter(id => !existingPlayerIds.includes(id))

    if (invalidPlayerIds.length > 0) {
      return NextResponse.json(
        { error: `Players not found: ${invalidPlayerIds.join(", ")}` },
        { status: 400 }
      )
    }

    // Get existing memberships to avoid duplicates
    const { data: existingMemberships, error: membershipsError } = await supabase
      .from("list_memberships")
      .select("lead_id")
      .eq("list_id", id)
      .in("lead_id", playerIds)

    if (membershipsError) {
      throw membershipsError
    }

    const existingMembershipIds = new Set(existingMemberships?.map(m => m.lead_id) || [])
    const newPlayerIds = playerIds.filter(playerId => !existingMembershipIds.has(playerId))

    // Insert new memberships (upsert to respect unique constraint)
    let added = 0
    if (newPlayerIds.length > 0) {
      const membershipsToInsert = newPlayerIds.map(playerId => ({
        list_id: id,
        lead_id: playerId,
      }))

      const { error: insertError } = await supabase
        .from("list_memberships")
        .upsert(membershipsToInsert, { onConflict: "list_id,lead_id" })

      if (insertError) {
        throw insertError
      }

      added = newPlayerIds.length
    }

    return NextResponse.json({ added })
  } catch (error) {
    console.error("[v0] Error adding members to list:", error)
    return NextResponse.json(
      { error: "Failed to add members to list" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { playerIds } = body

    // Validate playerIds
    if (!playerIds || !Array.isArray(playerIds) || playerIds.length === 0) {
      return NextResponse.json(
        { error: "playerIds must be a non-empty array" },
        { status: 400 }
      )
    }

    // Verify list exists
    const { data: list, error: listError } = await supabase
      .from("lists")
      .select("id")
      .eq("id", id)
      .single()

    if (listError) {
      if (listError.code === "PGRST116") {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        )
      }
      throw listError
    }

    // Delete memberships
    const { data: deletedMemberships, error: deleteError } = await supabase
      .from("list_memberships")
      .delete()
      .eq("list_id", id)
      .in("lead_id", playerIds)
      .select()

    if (deleteError) {
      throw deleteError
    }

    const removed = deletedMemberships?.length || 0

    return NextResponse.json({ removed })
  } catch (error) {
    console.error("[v0] Error removing members from list:", error)
    return NextResponse.json(
      { error: "Failed to remove members from list" },
      { status: 500 }
    )
  }
}
