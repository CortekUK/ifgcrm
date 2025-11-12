import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Mock data - replace with actual database query
  const checklist = [
    {
      id: 1,
      name: "Passport copy",
      status: "completed",
      upload_enabled: true,
    },
    {
      id: 2,
      name: "Academic transcripts",
      status: "missing",
      upload_enabled: true,
    },
    {
      id: 3,
      name: "Visa document",
      status: "missing",
      upload_enabled: true,
    },
    {
      id: 4,
      name: "Medical certificate",
      status: "completed",
      upload_enabled: true,
    },
  ]

  return NextResponse.json(checklist)
}
