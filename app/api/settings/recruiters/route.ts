import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: recruiters, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .order("full_name")

    if (error) throw error

    return NextResponse.json(recruiters || [])
  } catch (error) {
    console.error("[v0] Error fetching recruiters:", error)
    // Return mock data as fallback
    const mockRecruiters = [
      { id: "1", full_name: "Chris" },
      { id: "2", full_name: "Sarah" },
      { id: "3", full_name: "Mike" },
      { id: "4", full_name: "Emma" },
    ]
    return NextResponse.json(mockRecruiters)
  }
}
