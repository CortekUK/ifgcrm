import { NextResponse } from "next/server"

export async function GET() {
  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: "Nathan Bibby",
      email: "nathan@ifgcrm.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah@ifgcrm.com",
      role: "recruiter",
      status: "Active",
    },
    {
      id: 3,
      name: "Chris Thompson",
      email: "chris@ifgcrm.com",
      role: "recruiter",
      status: "Active",
    },
    {
      id: 4,
      name: "Emma Johnson",
      email: "emma@ifgcrm.com",
      role: "finance",
      status: "Pending",
    },
  ]

  return NextResponse.json(mockUsers)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
    role: body.role,
    status: "Pending",
  }

  return NextResponse.json(newUser, { status: 201 })
}
