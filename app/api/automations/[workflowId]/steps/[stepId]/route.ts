import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: { workflowId: string; stepId: string } }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile to check permissions (admin only)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "You don't have permission to edit automation steps" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { workflowId, stepId } = params

    // Validate request body based on step type
    if (body.subject !== undefined) {
      // Email step update
      if (!body.subject?.trim()) {
        return NextResponse.json(
          { error: "Subject line is required" },
          { status: 400 }
        )
      }
      
      // In a real implementation, update the automation step in the database
      // For now, simulate a successful update
      console.log(`[v0] Updating email step ${stepId} for workflow ${workflowId}:`, {
        subject: body.subject,
        body: body.body,
        fromName: body.fromName,
        replyTo: body.replyTo,
      })
      
      return NextResponse.json({
        success: true,
        message: "Email step updated successfully",
      })
    } else if (body.waitValue !== undefined) {
      // Wait step update
      if (body.waitValue <= 0) {
        return NextResponse.json(
          { error: "Wait time must be greater than zero" },
          { status: 400 }
        )
      }
      
      // In a real implementation, update the automation step in the database
      console.log(`[v0] Updating wait step ${stepId} for workflow ${workflowId}:`, {
        waitValue: body.waitValue,
        waitUnit: body.waitUnit,
      })
      
      return NextResponse.json({
        success: true,
        message: "Wait step updated successfully",
      })
    }

    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[v0] Error updating automation step:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
