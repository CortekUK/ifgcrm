import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  console.log("[v0] Search API called with query:", query)

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ players: [], programmes: [], activities: [] })
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchTerm = `%${query.toLowerCase()}%`

  try {
    // Search leads (players)
    const { data: players, error: playersError } = await supabase
      .from("leads")
      .select("id, name, email, status")
      .or(`name.ilike.${searchTerm},email.ilike.${searchTerm}`)
      .eq("user_id", user.id)
      .limit(5)

    console.log("[v0] Players found:", players?.length || 0, "Error:", playersError)

    // Search programs
    const { data: programmes, error: programmesError } = await supabase
      .from("programs")
      .select("id, name, description")
      .ilike("name", searchTerm)
      .eq("user_id", user.id)
      .limit(5)

    console.log("[v0] Programmes found:", programmes?.length || 0, "Error:", programmesError)

    // Search activities
    const { data: activities, error: activitiesError } = await supabase
      .from("activities")
      .select("id, description, type, created_at")
      .ilike("description", searchTerm)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    console.log("[v0] Activities found:", activities?.length || 0, "Error:", activitiesError)

    return NextResponse.json({
      players: players || [],
      programmes: programmes || [],
      activities: activities || [],
    })
  } catch (error) {
    console.error("[v0] Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
