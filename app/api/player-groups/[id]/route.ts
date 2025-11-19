import { type NextRequest, NextResponse } from "next/server"

// Import from parent route to share the mock data
// In a real app, this would be from a database
const mockGroups = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const group = mockGroups.find((g) => g.id === params.id)

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json(group)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, playerIds } = body

    const group = mockGroups.find((g) => g.id === params.id)

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    if (action === "add") {
      // Add players to the group
      const newPlayerIds = playerIds.filter((id: number) => !group.playerIds.includes(id))
      group.playerIds.push(...newPlayerIds)
      group.playerCount = group.playerIds.length
      group.updatedAt = new Date().toISOString()
    } else if (action === "remove") {
      // Remove players from the group
      group.playerIds = group.playerIds.filter((id) => !playerIds.includes(id))
      group.playerCount = group.playerIds.length
      group.updatedAt = new Date().toISOString()
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'add' or 'remove'" },
        { status: 400 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error("Error updating group members:", error)
    return NextResponse.json(
      { error: "Failed to update group members" },
      { status: 500 }
    )
  }
}