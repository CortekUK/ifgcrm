"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { CheckCircle2, Lock, Mail, Eye, EyeOff, Trophy, TrendingUp, MapPin } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const setupSuccess = searchParams.get("setup") === "success"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Invalid email or password. Make sure you've signed up and verified your email.")
        }
        throw error
      }
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@700&display=swap');
        
        .login-page {
          font-family: 'Inter', sans-serif;
        }
        
        .login-page h1,
        .login-page h2,
        .login-page h3,
        .login-page .heading {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .login-page label,
        .login-page input,
        .login-page p,
        .login-page span {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
        }
        
        .login-page button {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="login-page flex min-h-screen w-full">
        {/* Left side - Hero Section */}
        <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#172554] p-12">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url(/uk-football-team-training.jpg)",
              opacity: 0.3,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af]/90 via-[#1e3a8a]/85 to-[#172554]/90" />

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Map Pin Icon with Globe */}
              <div className="relative flex h-14 w-14 items-center justify-center">
                <MapPin className="h-14 w-14 text-white fill-white" />
                <div className="absolute top-3 left-1/2 -translate-x-1/2">
                  <svg
                    className="h-5 w-5 text-[#1e3a8a]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" strokeWidth="1.5" />
                    <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <div className="text-[11px] font-bold tracking-[0.15em] text-white leading-tight">
                  THE INTERNATIONAL
                </div>
                <div className="text-[28px] font-black tracking-tight text-white leading-none">FOOTBALL</div>
                <div className="text-[28px] font-black tracking-tight text-white leading-none">GROUP</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="heading text-4xl text-white mb-4 leading-tight">
                Manage Your Football
                <br />
                Academy with Confidence
              </h2>
              <p className="text-lg text-blue-200 leading-relaxed">
                Streamline recruitment, track player progress, and manage campaigns all in one powerful platform.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="heading text-base text-white mb-1">Player Recruitment</h3>
                  <p className="text-sm text-blue-200">Track deals through every stage of your pipeline</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="heading text-base text-white mb-1">Campaign Management</h3>
                  <p className="text-sm text-blue-200">Create and send targeted email campaigns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="heading text-base text-white mb-1">Performance Analytics</h3>
                  <p className="text-sm text-blue-200">Monitor player progress and recruitment metrics</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="heading text-base text-white mb-1">Email Automation</h3>
                  <p className="text-sm text-blue-200">Automated workflows for player engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="heading text-base text-white mb-1">Team Collaboration</h3>
                  <p className="text-sm text-blue-200">Multiple recruiters working together seamlessly</p>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="pt-6 mt-6 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-bold text-white">5000+</div>
                  <div className="text-xs text-blue-200 mt-1">Players Placed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-xs text-blue-200 mt-1">Partner Academies</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">15+</div>
                  <div className="text-xs text-blue-200 mt-1">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-sm text-blue-200">
            <p className="mx-0 my-2.5">© 2025 International Football Group</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-8">
              {/* Mobile Logo */}
              <div className="flex lg:hidden flex-col items-center gap-2 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <MapPin className="h-16 w-16 text-[#1e3a8a] fill-[#1e3a8a]" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" strokeWidth="1.5" />
                      <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[9px] font-bold tracking-[0.15em] text-gray-600 leading-tight">
                    THE INTERNATIONAL
                  </div>
                  <div className="text-[22px] font-black tracking-tight text-[#1e3a8a] leading-none">FOOTBALL</div>
                  <div className="text-[22px] font-black tracking-tight text-[#1e3a8a] leading-none">GROUP</div>
                </div>
              </div>

              {setupSuccess && (
                <Alert className="bg-green-50 border-green-200 animate-fade-in">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Admin account created successfully! You can now login.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <div className="mb-8">
                  <h2 className="heading text-3xl text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-shake">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-[10px] bg-[#0A47B1] hover:bg-[#083a91] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500">
                        Don't have an account?
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link href="/auth/sign-up">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium transition-all bg-transparent"
                      >
                        Create an account
                      </Button>
                    </Link>
                    <Link href="/setup-admin" className="text-center">
                      <span className="text-sm text-gray-600">
                        Need to setup an admin account?{" "}
                        <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                          Setup Admin
                        </span>
                      </span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
