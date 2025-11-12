import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const programme = searchParams.get("programme")
  const search = searchParams.get("search")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")

  // Mock invoice data with 120 invoices
  const programmes = ["UK Academy", "Spain Academy", "USA Academy", "Brazil Academy"]
  const statuses = ["draft", "sent", "paid", "overdue"]
  const names = [
    "Daniel Perez",
    "Marcus Silva",
    "James Wilson",
    "Carlos Rodriguez",
    "Tom Anderson",
    "Luis Martinez",
    "David Thompson",
    "Miguel Santos",
    "Alex Johnson",
    "Roberto Garcia",
    "Chris Evans",
    "Fernando Lopez",
    "Ryan Murphy",
    "Diego Costa",
    "Matt Brown",
    "Pablo Hernandez",
    "Jake Williams",
    "Jorge Ramirez",
    "Ben Davis",
    "Antonio Gomez",
  ]

  const allInvoices = Array.from({ length: 120 }, (_, i) => {
    const statusValue = statuses[i % 4]
    const daysOffset = statusValue === "overdue" ? -((i % 30) + 1) : statusValue === "paid" ? -(i % 20) : (i % 30) + 1

    return {
      id: 5000 + i,
      invoice_number: `INV-${5000 + i}`,
      player_name: names[i % names.length],
      programme: programmes[i % programmes.length],
      amount: 1000 + (i % 10) * 250,
      currency: "GBP",
      status: statusValue,
      due_date: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      payment_url: `https://pay.ifgcrm.com/inv/${5000 + i}`,
    }
  })

  // Filter invoices
  let filteredInvoices = allInvoices

  if (status && status !== "all") {
    filteredInvoices = filteredInvoices.filter((inv) => inv.status === status)
  }

  if (programme && programme !== "all") {
    filteredInvoices = filteredInvoices.filter((inv) => inv.programme === programme)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredInvoices = filteredInvoices.filter(
      (inv) =>
        inv.player_name.toLowerCase().includes(searchLower) || inv.invoice_number.toLowerCase().includes(searchLower),
    )
  }

  // Paginate
  const total = filteredInvoices.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex)

  return NextResponse.json({
    data: paginatedInvoices,
    total,
    page,
    pageSize,
  })
}
