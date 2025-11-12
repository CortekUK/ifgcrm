import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent you a verification link. Please check your email to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">After verifying your email, you can log in to your account.</p>
            <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:underline">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
