import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        program:programs(name),
        recruiter:profiles(full_name)
      `
      )
      .limit(1000)

    if (error) throw error

    const csv = [
      ["Name", "Email", "Phone", "Programme", "Recruiter", "Status"].join(","),
      ...(data || []).map((lead: any) =>
        [
          lead.name,
          lead.email,
          lead.phone,
          lead.program?.name || "",
          lead.recruiter?.full_name || "",
          lead.status || "",
        ].join(",")
      ),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="list-${params.id}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting list:", error)
    return NextResponse.json({ error: "Failed to export list" }, { status: 500 })
  }
}
