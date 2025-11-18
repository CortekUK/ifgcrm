import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")

    if (!q || q.trim().length === 0) {
      return NextResponse.json([])
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchTerm = `%${q.toLowerCase()}%`

    // Search leads (players) by name, email, or phone
    const { data: players, error } = await supabase
      .from("leads")
      .select(`
        id,
        name,
        email,
        phone,
        status,
        programs:program_id (
          id,
          name
        )
      `)
      .or(`name.ilike.${searchTerm},email.ilike.${searchTerm},phone.ilike.${searchTerm}`)
      .eq("user_id", user.id)
      .limit(10)

    if (error) throw error

    // Transform to match API contract
    const results = (players || []).map((player: any) => ({
      id: player.id,
      name: player.name,
      programmeName: player.programs?.name || null,
      status: player.status,
      phoneNumber: player.phone,
    }))

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("[v0] Error searching players:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
