import { type NextRequest, NextResponse } from "next/server"

// Import the shared templates store
// In a real app, this would be a database query
let templatesStore: any[] = []

// Helper to get the templates store (would be replaced with DB in production)
async function getTemplatesStore() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/templates`)
  const data = await response.json()
  return data.data
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // For now, return a mock template since we can't easily share memory between routes
  // In production, this would query the database
  const template = {
    id: params.id,
    name: "Sample Template",
    type: "email",
    category: "newsletter",
    subject: "Newsletter Subject",
    preheader: "Newsletter preview",
    content: "This is a sample template content.",
    htmlContent: "<h1>Sample Template</h1><p>This is a sample template.</p>",
    blocks: [
      { type: "text", value: "Sample template content" }
    ],
    fromName: "IFG Team",
    fromEmail: "info@ifg.com",
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

  // In production, this would update the database
  return NextResponse.json({ data: updatedTemplate })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // In production, this would delete from the database
  return NextResponse.json({ success: true })
}
