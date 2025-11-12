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
  const balanceData = {
    total_programme_cost: 15000,
    paid_so_far: 10000,
    amount_due: 5000,
    currency: "GBP",
  }

  return NextResponse.json(balanceData)
}
