import { type NextRequest, NextResponse } from "next/server"

// Mock data storage for player groups
let mockGroups = [
  {
    id: "1",
    name: "High Priority Prospects",
    description: "Top talent players for immediate recruitment",
    playerIds: [1, 3, 5, 7, 9, 11, 13, 15],
    color: "#3B82F6",
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-01-15").toISOString(),
    playerCount: 8,
  },
  {
    id: "2",
    name: "US College 2026 Candidates",
    description: "Players targeted for US College 2026 programme",
    playerIds: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    color: "#10B981",
    createdAt: new Date("2024-01-20").toISOString(),
    updatedAt: new Date("2024-01-20").toISOString(),
    playerCount: 10,
  },
  {
    id: "3",
    name: "Goalkeepers",
    description: "All goalkeeper positions",
    playerIds: [5, 10, 15, 20, 25, 30],
    color: "#F59E0B",
    createdAt: new Date("2024-01-22").toISOString(),
    updatedAt: new Date("2024-01-22").toISOString(),
    playerCount: 6,
  },
  {
    id: "4",
    name: "International Players",
    description: "Players from international markets",
    playerIds: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    color: "#8B5CF6",
    createdAt: new Date("2024-01-25").toISOString(),
    updatedAt: new Date("2024-01-25").toISOString(),
    playerCount: 10,
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""

  let filtered = mockGroups

  if (search) {
    filtered = filtered.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, playerIds, color } = body

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      )
    }

    const newGroup = {
      id: String(mockGroups.length + 1),
      name,
      description: description || "",
      playerIds: playerIds || [],
      color: color || "#3B82F6",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      playerCount: (playerIds || []).length,
    }

    mockGroups.push(newGroup)

    return NextResponse.json(newGroup, { status: 201 })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, playerIds, color } = body

    if (!id) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      )
    }

    const groupIndex = mockGroups.findIndex((g) => g.id === id)

    if (groupIndex === -1) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      )
    }

    mockGroups[groupIndex] = {
      ...mockGroups[groupIndex],
      name: name || mockGroups[groupIndex].name,
      description: description !== undefined ? description : mockGroups[groupIndex].description,
      playerIds: playerIds !== undefined ? playerIds : mockGroups[groupIndex].playerIds,
      color: color || mockGroups[groupIndex].color,
      updatedAt: new Date().toISOString(),
      playerCount: playerIds ? playerIds.length : mockGroups[groupIndex].playerCount,
    }

    return NextResponse.json(mockGroups[groupIndex])
  } catch (error) {
    console.error("Error updating group:", error)
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      )
    }

    const groupIndex = mockGroups.findIndex((g) => g.id === id)

    if (groupIndex === -1) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      )
    }

    mockGroups.splice(groupIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting group:", error)
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    )
  }
}