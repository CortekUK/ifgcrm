import { NextResponse } from "next/server"

export async function GET() {
  // Mock recruiters data
  const mockRecruiters = [
    { id: 1, name: "Chris" },
    { id: 2, name: "Sarah" },
    { id: 3, name: "Mike" },
    { id: 4, name: "Emma" },
  ]

  return NextResponse.json(mockRecruiters)
}
