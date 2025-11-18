import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Fetch the list
    const { data: list, error: listError } = await supabase
      .from("lists")
      .select("*")
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

    // Count memberships
    const { count, error: countError } = await supabase
      .from("list_memberships")
      .select("*", { count: "exact", head: true })
      .eq("list_id", id)

    if (countError) {
      console.error(`[v0] Error counting members for list ${id}:`, countError)
    }

    return NextResponse.json({
      id: list.id,
      name: list.name,
      description: list.description || null,
      type: list.type as "STATIC" | "SMART",
      filtersJson: list.filters_json || null,
      contactCount: count || 0,
      createdAt: list.created_at,
      updatedAt: list.updated_at,
    })
  } catch (error) {
    console.error("[v0] Error fetching list:", error)
    return NextResponse.json(
      { error: "Failed to load list" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const { name, description, type, filtersJson } = body

    // Validate name if provided
    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      )
    }

    // Validate type if provided
    if (type !== undefined && !["STATIC", "SMART"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be STATIC or SMART" },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (filtersJson !== undefined) {
      updateData.filters_json = typeof filtersJson === "string"
        ? filtersJson
        : JSON.stringify(filtersJson)
    }

    // Update the list
    const { data: list, error: updateError } = await supabase
      .from("lists")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return NextResponse.json(
          { error: "List not found" },
          { status: 404 }
        )
      }
      throw updateError
    }

    // Count memberships
    const { count, error: countError } = await supabase
      .from("list_memberships")
      .select("*", { count: "exact", head: true })
      .eq("list_id", id)

    if (countError) {
      console.error(`[v0] Error counting members for list ${id}:`, countError)
    }

    return NextResponse.json({
      id: list.id,
      name: list.name,
      description: list.description || null,
      type: list.type as "STATIC" | "SMART",
      filtersJson: list.filters_json || null,
      contactCount: count || 0,
      createdAt: list.created_at,
      updatedAt: list.updated_at,
    })
  } catch (error) {
    console.error("[v0] Error updating list:", error)
    return NextResponse.json(
      { error: "Failed to update list" },
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

    // Delete all list memberships first (cascade)
    const { error: membershipError } = await supabase
      .from("list_memberships")
      .delete()
      .eq("list_id", id)

    if (membershipError) {
      console.error("[v0] Error deleting list memberships:", membershipError)
      throw membershipError
    }

    // Delete the list
    const { error: listError } = await supabase
      .from("lists")
      .delete()
      .eq("id", id)

    if (listError) {
      console.error("[v0] Error deleting list:", listError)
      throw listError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting list:", error)
    return NextResponse.json(
      { error: "Failed to delete list" },
      { status: 500 }
    )
  }
}
