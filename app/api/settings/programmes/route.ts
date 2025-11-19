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
    // Return mock data as fallback - UK Colleges
    const mockProgrammes = [
      {
        id: "1",
        name: "University of Oxford",
        active: true,
        color: "#002147",
      },
      {
        id: "2",
        name: "University of Cambridge",
        active: true,
        color: "#00B1C1",
      },
      {
        id: "3",
        name: "Imperial College London",
        active: true,
        color: "#003E74",
      },
      {
        id: "4",
        name: "UCL (University College London)",
        active: true,
        color: "#500778",
      },
      {
        id: "5",
        name: "University of Manchester",
        active: true,
        color: "#660099",
      },
      {
        id: "6",
        name: "King's College London",
        active: true,
        color: "#1B4F91",
      },
      {
        id: "7",
        name: "University of Edinburgh",
        active: true,
        color: "#00325F",
      },
      {
        id: "8",
        name: "University of Bristol",
        active: true,
        color: "#B01C2E",
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
