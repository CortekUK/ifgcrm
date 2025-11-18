import { NextResponse } from "next/server"

export async function GET() {
  const mockPipelines = [
    {
      id: 1,
      name: "US College Recruitment",
      stageCount: 5,
      linkedProgramme: "US College 2026",
      dealCount: 15, // Total deals across all stages
    },
    {
      id: 2,
      name: "European Pathway",
      stageCount: 4,
      linkedProgramme: "European Academy",
      dealCount: 2,
    },
    {
      id: 3,
      name: "UK Academy Pipeline",
      stageCount: 3,
      linkedProgramme: null,
      dealCount: 2,
    },
  ]

  return NextResponse.json(mockPipelines)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newPipeline = {
    id: Date.now(),
    name: body.name,
    stageCount: 0,
    linkedProgramme: null,
    dealCount: 0, // Initialize deal count for new pipeline
  }

  return NextResponse.json(newPipeline, { status: 201 })
}
