import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get("ids")

    if (!idsParam) {
      return NextResponse.json({ error: "No contact IDs provided" }, { status: 400 })
    }

    const ids = idsParam.split(",").map((id) => parseInt(id))

    const { data, error } = await supabase
      .from("leads")
      .select(
        `
        *,
        program:programs(name),
        recruiter:profiles(full_name)
      `
      )
      .in("id", ids)

    if (error) throw error

    const csv = [
      ["Name", "Email", "Phone", "Programme", "Recruiter", "Status", "Date Created"].join(","),
      ...(data || []).map((lead: any) =>
        [
          lead.name,
          lead.email,
          lead.phone,
          lead.program?.name || "",
          lead.recruiter?.full_name || "",
          lead.status || "",
          new Date(lead.created_at).toLocaleDateString("en-GB"),
        ].join(",")
      ),
    ].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="contacts-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting contacts:", error)
    return NextResponse.json({ error: "Failed to export contacts" }, { status: 500 })
  }
}
