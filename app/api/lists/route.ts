import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: lists, error } = await supabase
      .from("lists")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching lists:", error)
      throw error
    }

    const listsWithCounts = await Promise.all(
      (lists || []).map(async (list: any) => {
        const { count, error: countError } = await supabase
          .from("list_memberships")
          .select("*", { count: "exact", head: true })
          .eq("list_id", list.id)

        if (countError) {
          console.error(`[v0] Error counting members for list ${list.id}:`, countError)
        }

        return {
          id: list.id,
          name: list.name,
          description: list.description || null,
          type: list.type as "STATIC" | "SMART",
          contactCount: count || 0,
          createdAt: list.created_at,
        }
      })
    )

    return NextResponse.json(listsWithCounts)
  } catch (error) {
    console.error("[v0] Error fetching lists:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { name, description, type, filtersJson } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const listType = type || "STATIC"

    if (!["STATIC", "SMART"].includes(listType)) {
      return NextResponse.json(
        { error: "Type must be STATIC or SMART" },
        { status: 400 }
      )
    }

    const insertData: any = {
      name: name.trim(),
      description: description || null,
      type: listType,
    }

    if (listType === "SMART" && filtersJson) {
      insertData.filters_json = typeof filtersJson === "string" 
        ? filtersJson 
        : JSON.stringify(filtersJson)
    }

    const { data, error } = await supabase
      .from("lists")
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating list:", error)
      throw error
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description || null,
      type: data.type as "STATIC" | "SMART",
      contactCount: 0,
      createdAt: data.created_at,
    })
  } catch (error) {
    console.error("[v0] Error creating list:", error)
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500 }
    )
  }
}
