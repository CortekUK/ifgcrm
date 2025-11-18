import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "50")
    const search = searchParams.get("search")
    const programmeId = searchParams.get("programmeId")
    const tag = searchParams.get("tag")
    const recruiterId = searchParams.get("recruiterId")
    const country = searchParams.get("country")
    const status = searchParams.get("status")
    const listId = searchParams.get("listId")

    let query = supabase
      .from("leads")
      .select(
        `
        id,
        name,
        email,
        phone,
        status,
        notes,
        created_at,
        program:programs!program_id(id, name),
        recruiter:profiles!user_id(id, full_name)
      `,
        { count: "exact" }
      )

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (programmeId && programmeId !== "all") {
      query = query.eq("program_id", programmeId)
    }

    if (recruiterId && recruiterId !== "all") {
      query = query.eq("user_id", recruiterId)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (country && country !== "all") {
      // This filter will be applied when country column exists
      query = query.eq("country", country)
    }

    const offset = (page - 1) * pageSize
    query = query.range(offset, offset + pageSize - 1).order("created_at", { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error("[v0] Error querying leads:", error)
      throw error
    }

    let filteredData = data || []
    if (listId && listId !== "all") {
      try {
        const { data: memberships } = await supabase
          .from("list_memberships")
          .select("lead_id")
          .eq("list_id", listId)

        if (memberships) {
          const memberLeadIds = new Set(memberships.map((m) => m.lead_id))
          filteredData = filteredData.filter((lead) => memberLeadIds.has(lead.id))
        }
      } catch (listError) {
        // Lists table might not exist yet, continue without filtering
        console.log("[v0] Lists table not available yet, skipping list filter")
      }
    }

    let listMembershipsMap: Record<string, any[]> = {}
    if (filteredData.length > 0) {
      try {
        const leadIds = filteredData.map((lead) => lead.id)
        const { data: memberships } = await supabase
          .from("list_memberships")
          .select(
            `
            lead_id,
            list:lists(id, name)
          `
          )
          .in("lead_id", leadIds)

        if (memberships) {
          memberships.forEach((membership: any) => {
            if (!listMembershipsMap[membership.lead_id]) {
              listMembershipsMap[membership.lead_id] = []
            }
            if (membership.list) {
              listMembershipsMap[membership.lead_id].push({
                id: membership.list.id,
                name: membership.list.name,
              })
            }
          })
        }
      } catch (listError) {
        // Lists table might not exist yet, continue without list data
        console.log("[v0] Lists table not available yet, skipping list memberships")
      }
    }

    const contacts = filteredData.map((lead: any) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || null,
      programme: lead.program
        ? { id: lead.program.id, name: lead.program.name }
        : null,
      recruiter: lead.recruiter
        ? { id: lead.recruiter.id, name: lead.recruiter.full_name }
        : null,
      tags: [], // TODO: Parse from notes or add tags column
      lists: listMembershipsMap[lead.id] || [],
      country: null, // TODO: Add country column to leads table
      status: lead.status || null,
      createdAt: lead.created_at,
    }))

    const totalCount = listId && listId !== "all" ? contacts.length : (count || 0)
    const totalPages = Math.ceil(totalCount / pageSize)

    return NextResponse.json({
      data: contacts,
      pagination: {
        page,
        pageSize,
        total: totalCount,
        totalPages,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching contacts:", error)
    return NextResponse.json(
      { error: "Failed to load contacts" },
      { status: 500 }
    )
  }
}
