import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const userId = params.id

  // Mock updating a user
  const updatedUser = {
    id: Number.parseInt(userId),
    ...body,
  }

  return NextResponse.json(updatedUser)
}
