import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data: programmes, error } = await supabase
      .from("programs")
      .select("id, name, description, color")
      .order("name")

    if (error) throw error

    return NextResponse.json(programmes || [])
  } catch (error) {
    console.error("[v0] Error fetching programmes:", error)
    // Return mock data as fallback
    const mockProgrammes = [
      {
        id: "1",
        name: "US College 2026",
        active: true,
      },
      {
        id: "2",
        name: "US College 2027",
        active: true,
      },
      {
        id: "3",
        name: "European Academy",
        active: true,
      },
    ]
    return NextResponse.json(mockProgrammes)
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  // Mock creating a programme
  const newProgramme = {
    id: Date.now(),
    name: body.name,
    pipelineId: body.pipelineId,
    pipelineName: body.pipelineId ? "Sample Pipeline" : null,
    active: body.active,
  }

  return NextResponse.json(newProgramme, { status: 201 })
}
