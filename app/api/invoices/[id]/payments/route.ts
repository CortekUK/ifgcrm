import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Mock payments data - replace with actual database query
  const mockPayments = [
    {
      id: 1,
      invoice_id: Number.parseInt(params.id),
      amount: 2500,
      date: "2025-01-05",
      method: "Card",
      status: "Completed",
    },
    {
      id: 2,
      invoice_id: Number.parseInt(params.id),
      amount: 1500,
      date: "2024-12-15",
      method: "Bank Transfer",
      status: "Completed",
    },
  ]

  // Filter payments for this invoice
  const payments = mockPayments.filter((p) => p.invoice_id === Number.parseInt(params.id))

  return NextResponse.json({
    payments,
    total: payments.reduce((sum, p) => sum + p.amount, 0),
  })
}
