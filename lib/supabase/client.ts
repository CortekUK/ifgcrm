import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cujprjusexjzuapydiuf.supabase.co"

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anByanVzZXhqenVhcHlkaXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDg1MTQsImV4cCI6MjA3ODE4NDUxNH0.TTRG0g8vh3-IpQ3YkJxFoLlQEa5IfAAkJIUrJa1XogA"

  client = createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return document.cookie
          .split("; ")
          .find((row) => row.startsWith(name + "="))
          ?.split("=")[1]
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=/; max-age=${options.maxAge}; SameSite=Lax`
      },
      remove(name: string, options: any) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      },
    },
  })

  return client
}
