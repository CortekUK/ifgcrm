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
  const playerData = {
    id: user.id,
    name: "James Anderson",
    email: user.email,
    programme: "US College 2026",
    recruiter_name: "Sarah Mitchell",
    recruiter_email: "sarah@ifgacademy.com",
    status: "Active",
  }

  return NextResponse.json(playerData)
}
