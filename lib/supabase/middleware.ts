import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cujprjusexjzuapydiuf.supabase.co"

  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anByanVzZXhqenVhcHlkaXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDg1MTQsImV4cCI6MjA3ODE4NDUxNH0.TTRG0g8vh3-IpQ3YkJxFoLlQEa5IfAAkJIUrJa1XogA"

  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, {
            ...options,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          })
        })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  let user = null
  if (session) {
    user = session.user
  }

  if (request.nextUrl.pathname.startsWith("/setup-admin") || request.nextUrl.pathname.startsWith("/auth")) {
    return supabaseResponse
  }

  // Protect admin routes - require authentication and admin role
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }

    // Skip role check for admin login page
    if (!request.nextUrl.pathname.startsWith("/admin/login")) {
      try {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile?.role !== "admin") {
          const url = request.nextUrl.clone()
          url.pathname = "/admin/login"
          return NextResponse.redirect(url)
        }
      } catch (error) {
        console.error("[v0] Error checking admin role:", error)
      }
    }
  }

  // Protect regular authenticated routes
  if (!user && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
