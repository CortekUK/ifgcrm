import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pipeline_id, name, color, order } = body

    // Validate required fields
    if (!pipeline_id || !name) {
      return NextResponse.json({ error: "Pipeline ID and stage name are required" }, { status: 400 })
    }

    // In a real implementation, this would create a new stage in the database
    // For now, we'll return a success response with mock data
    const newStage = {
      id: Math.floor(Math.random() * 10000) + 100,
      pipeline_id: Number.parseInt(pipeline_id),
      name,
      color: color || "#14b8a6",
      order: order || 1,
      created_at: new Date().toISOString(),
    }

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(newStage, { status: 201 })
  } catch (error) {
    console.error("Error creating stage:", error)
    return NextResponse.json({ error: "Failed to create stage" }, { status: 500 })
  }
}
