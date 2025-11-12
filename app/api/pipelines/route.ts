import { NextResponse } from "next/server"

export async function GET() {
  const mockPipelines = [
    {
      id: 1,
      name: "US College Recruitment",
      stageCount: 5,
      linkedProgramme: "US College 2026",
    },
    {
      id: 2,
      name: "European Pathway",
      stageCount: 4,
      linkedProgramme: "European Academy",
    },
    {
      id: 3,
      name: "UK Academy Pipeline",
      stageCount: 3,
      linkedProgramme: null,
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
  }

  return NextResponse.json(newPipeline, { status: 201 })
}
