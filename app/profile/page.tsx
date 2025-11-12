"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { AppLayout } from "@/components/layout/app-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { User } from "@supabase/supabase-js"

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase])

  if (loading || !user) {
    return (
      <AppLayout user={user} currentPath="/profile">
        <div className="flex h-screen items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={user} currentPath="/profile">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account information and preferences</p>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ""} disabled className="mt-1.5 bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1.5">Your email address is managed by your administrator</p>
            </div>

            <div>
              <Label htmlFor="user-id">User ID</Label>
              <Input id="user-id" value={user.id} disabled className="mt-1.5 bg-gray-50 font-mono text-xs" />
            </div>

            <Separator className="my-4" />

            <div>
              <Label htmlFor="created">Account Created</Label>
              <Input
                id="created"
                value={new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                disabled
                className="mt-1.5 bg-gray-50"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <Label>Password</Label>
              <div className="mt-1.5 flex items-center gap-3">
                <Input type="password" value="••••••••••••" disabled className="bg-gray-50" />
                <Button variant="outline" disabled>
                  Change
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Contact your administrator to reset your password</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
