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
  const invoices = [
    {
      id: 5012,
      invoice_number: "INV-5012",
      description: "IFG Academy – Term 1",
      amount: 1000,
      currency: "GBP",
      status: "unpaid",
      due_date: "2025-11-15",
      payment_url: "https://pay.ifgcrm.com/inv/5012",
    },
    {
      id: 4890,
      invoice_number: "INV-4890",
      description: "IFG Academy – Deposit",
      amount: 2000,
      currency: "GBP",
      status: "paid",
      due_date: "2025-09-01",
      payment_url: "https://pay.ifgcrm.com/inv/4890",
    },
    {
      id: 5134,
      invoice_number: "INV-5134",
      description: "IFG Academy – Term 2",
      amount: 1500,
      currency: "GBP",
      status: "overdue",
      due_date: "2025-10-15",
      payment_url: "https://pay.ifgcrm.com/inv/5134",
    },
    {
      id: 5256,
      invoice_number: "INV-5256",
      description: "IFG Academy – Equipment Fee",
      amount: 500,
      currency: "GBP",
      status: "paid",
      due_date: "2025-09-20",
      payment_url: "https://pay.ifgcrm.com/inv/5256",
    },
  ]

  return NextResponse.json(invoices)
}
