import { NextResponse } from "next/server"

export async function GET() {
  // Mock programmes data with pipeline associations
  const mockProgrammes = [
    {
      id: 1,
      name: "US College 2026",
      pipelineId: 1,
      pipelineName: "US College Recruitment",
      active: true,
    },
    {
      id: 2,
      name: "US College 2027",
      pipelineId: 1,
      pipelineName: "US College Recruitment",
      active: true,
    },
    {
      id: 3,
      name: "European Academy",
      pipelineId: 2,
      pipelineName: "European Pathway",
      active: true,
    },
    {
      id: 4,
      name: "UK Programme",
      pipelineId: null,
      pipelineName: null,
      active: false,
    },
  ]

  return NextResponse.json(mockProgrammes)
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
