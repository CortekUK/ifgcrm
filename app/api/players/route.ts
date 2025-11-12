import { type NextRequest, NextResponse } from "next/server"

// Mock data
const mockPlayers = Array.from({ length: 138 }, (_, i) => ({
  id: i + 1,
  name: `Player ${i + 1}`,
  email: `player${i + 1}@example.com`,
  phone: `+1 555 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
  programme: ["US College 2026", "US College 2027", "European Academy", "UK Programme"][i % 4],
  recruiter: ["Chris", "Sarah", "Mike", "Emma"][i % 4],
  status: ["In pipeline", "Contacted", "Interview", "Signed"][i % 4],
  last_activity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  tags: [
    ["High Priority", "Striker"],
    ["Goalkeeper", "International"],
    ["Midfielder", "U18", "Left Footed"],
    ["Defender", "Scholarship"],
    ["High Priority", "U21"],
    [],
  ][i % 6],
}))

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const programme = searchParams.get("programme") || ""
  const recruiter = searchParams.get("recruiter") || ""
  const tag = searchParams.get("tag") || ""
  const status = searchParams.get("status") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "25")

  // Filter players
  let filtered = mockPlayers

  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (programme) {
    filtered = filtered.filter((p) => p.programme === programme)
  }

  if (recruiter) {
    filtered = filtered.filter((p) => p.recruiter === recruiter)
  }

  if (tag) {
    filtered = filtered.filter((p) => p.tags && p.tags.includes(tag))
  }

  if (status) {
    filtered = filtered.filter((p) => p.status.toLowerCase().includes(status.toLowerCase()))
  }

  // Paginate
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedPlayers = filtered.slice(start, end)

  return NextResponse.json({
    data: paginatedPlayers,
    total: filtered.length,
    page,
    pageSize,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, programme, recruiter, status, tags } = body

    if (!name || !email || !phone || !programme || !recruiter) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newPlayer = {
      id: mockPlayers.length + 1,
      name,
      email,
      phone,
      programme,
      recruiter,
      status: status || "Contacted",
      last_activity: new Date().toISOString(),
      tags: tags || [],
    }

    mockPlayers.push(newPlayer)

    return NextResponse.json(newPlayer, { status: 201 })
  } catch (error) {
    console.error("Error creating player:", error)
    return NextResponse.json({ error: "Failed to create player" }, { status: 500 })
  }
}
