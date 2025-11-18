import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // 'unmatched' | 'matched' | 'spam'
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "25")
    const offset = parseInt(searchParams.get("offset") || "0")
    const countOnly = searchParams.get("countOnly")

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("sms_messages")
      .select(`
        id,
        phone_number,
        message,
        status,
        created_at,
        source,
        lead_id,
        leads:lead_id (
          id,
          name,
          phone,
          email,
          programs:program_id (
            id,
            name
          )
        )
      `, { count: countOnly === "true" ? "exact" : undefined })
      .eq("user_id", user.id)
      .eq("direction", "inbound")

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status)
    }

    // Search across phone, message text, and player name
    if (search) {
      const searchTerm = `%${search}%`
      query = query.or(`phone_number.ilike.${searchTerm},message.ilike.${searchTerm}`)
    }

    // Return count only if requested
    if (countOnly === "true") {
      const { count, error } = await query
      if (error) throw error
      return NextResponse.json({ count: count || 0 })
    }

    // Apply pagination
    query = query
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    // Transform data to match API contract
    const replies = (data || []).map((item: any) => ({
      id: item.id,
      phoneNumber: item.phone_number,
      messageText: item.message,
      status: item.status,
      receivedAt: item.created_at,
      source: item.source,
      player: item.leads ? {
        id: item.leads.id,
        name: item.leads.name,
        programmeName: item.leads.programs?.name || null,
      } : null,
    }))

    return NextResponse.json(replies)
  } catch (error: any) {
    console.error("[v0] Error fetching SMS replies:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
