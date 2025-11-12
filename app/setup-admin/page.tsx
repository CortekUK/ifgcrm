import { setupAdmin } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCog } from "lucide-react"

export default function SetupAdminPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <UserCog className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>Create a super admin account with auto-verification</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={setupAdmin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@ifgcrm.com"
                defaultValue="admin@ifgcrm.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a secure password"
                defaultValue="SuperAdmin123!"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create Admin Account
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-4">
            This will create an admin account that's ready to use immediately
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
