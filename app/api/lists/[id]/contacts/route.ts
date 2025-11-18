import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        program:programs(name),
        recruiter:profiles(full_name)
      `
      )
      .limit(100)

    if (error) throw error

    const contacts = data?.map((lead: any) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      programme: lead.program?.name || "Unknown",
      recruiter: lead.recruiter?.full_name || "Unassigned",
      status: lead.status || "Unknown",
    }))

    return NextResponse.json(contacts || [])
  } catch (error) {
    console.error("[v0] Error fetching list contacts:", error)
    return NextResponse.json([], { status: 500 })
  }
}
