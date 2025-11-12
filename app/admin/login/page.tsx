"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Shield } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/admin/dashboard`,
        },
      })

      if (authError) throw authError

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (profileError) throw profileError

      if (profile?.role !== "admin") {
        // Sign out non-admin user
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      // Redirect to admin dashboard
      router.push("/admin/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg shadow-red-600/50">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-400">IFG CRM Administration</p>
          </div>
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
              <CardDescription className="text-slate-400">
                Enter your admin credentials to access the control panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Admin Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@ifg.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-200">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-600 bg-slate-900/50 text-white placeholder:text-slate-500"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Access Admin Panel"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-slate-400">
                  Not an admin?{" "}
                  <a href="/auth/login" className="font-medium text-blue-400 hover:underline">
                    Regular Login
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
