import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Mock getting a single template
  const template = {
    id: params.id,
    name: "Sample Template",
    type: "email",
    category: "newsletter",
    content: "This is a sample template.",
    htmlContent: "<h1>Sample Template</h1><p>This is a sample template.</p>",
    updated_at: new Date().toISOString(),
    usage_count: 5,
  }

  return NextResponse.json({ data: template })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json()

  const updatedTemplate = {
    id: params.id,
    ...body,
    updated_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: updatedTemplate })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ success: true })
}
