import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Mail, Activity } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/admin/login")
  }

  // Check admin role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/admin/login")
  }

  // Fetch admin stats
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: totalLeads } = await supabase.from("leads").select("*", { count: "exact", head: true })

  const { count: totalMessages } = await supabase.from("sms_messages").select("*", { count: "exact", head: true })

  const { count: todayActivity } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0])

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={user} />

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white">System Overview</h2>
          <p className="text-slate-400">Monitor and manage the entire CRM system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers || 0}</div>
              <p className="text-xs text-slate-400">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalLeads || 0}</div>
              <p className="text-xs text-slate-400">Across all users</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">SMS Messages</CardTitle>
              <Mail className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalMessages || 0}</div>
              <p className="text-xs text-slate-400">Total communications</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Today's Activity</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayActivity || 0}</div>
              <p className="text-xs text-slate-400">Actions today</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-white">Admin Actions</CardTitle>
            <CardDescription className="text-slate-400">System-wide management and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="font-semibold text-white mb-1">User Management</h3>
                <p className="text-sm text-slate-400">View and manage all user accounts</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="font-semibold text-white mb-1">System Settings</h3>
                <p className="text-sm text-slate-400">Configure global system parameters</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="font-semibold text-white mb-1">Analytics</h3>
                <p className="text-sm text-slate-400">View system-wide analytics and reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
