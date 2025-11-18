import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("sms_messages")
      .select(`
        *,
        leads!sms_messages_lead_id_fkey (id, name, phone, email)
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error fetching SMS reply:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
