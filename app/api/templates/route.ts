import { type NextRequest, NextResponse } from "next/server"

// Mock data for templates
const mockTemplates: any[] = []

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: mockTemplates })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newTemplate = {
    id: String(Date.now()),
    ...body,
    updated_at: new Date().toISOString(),
    usage_count: 0,
  }

  mockTemplates.push(newTemplate)

  return NextResponse.json({ data: newTemplate })
}
