import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const programmeId = params.id

  // Mock updating a programme
  const updatedProgramme = {
    id: Number.parseInt(programmeId),
    ...body,
  }

  return NextResponse.json(updatedProgramme)
}
