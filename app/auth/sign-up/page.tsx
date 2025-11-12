"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Eye, EyeOff, AlertCircle, MapPin, Mail, Lock, User } from "lucide-react"

const calculatePasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const feedback = [
    "Very weak - Add more characters",
    "Weak - Add uppercase and numbers",
    "Fair - Add special characters",
    "Good - Consider making it longer",
    "Strong - Excellent password!",
  ][score]

  return { score, feedback: feedback || "Too weak" }
}

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    repeatPassword: false,
  })
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" })

  const router = useRouter()

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password))
    } else {
      setPasswordStrength({ score: 0, feedback: "" })
    }
  }, [password])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateFullName = (name: string) => {
    return name.trim().length >= 2
  }

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500"
    if (score === 2) return "bg-orange-500"
    if (score === 3) return "bg-yellow-500"
    if (score === 4) return "bg-lime-500"
    return "bg-green-500"
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!validateFullName(fullName)) {
      setError("Please enter your full name (at least 2 characters)")
      setIsLoading(false)
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password")
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error

      if (data?.user) {
        router.push("/auth/verify-email")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      if (errorMessage.includes("already registered")) {
        setError("This email is already registered. Try logging in instead.")
      } else if (errorMessage.includes("invalid email")) {
        setError("Please enter a valid email address")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@700&display=swap');
        
        .signup-page {
          font-family: 'Inter', sans-serif;
        }
        
        .signup-page h1,
        .signup-page h2,
        .signup-page h3,
        .signup-page .heading {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .signup-page label,
        .signup-page input,
        .signup-page p,
        .signup-page span {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
        }
        
        .signup-page button {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="signup-page flex min-h-screen w-full">
        {/* Left side - Hero Section with brand colors and messaging */}
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

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-start gap-4">
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

              <div className="flex flex-col">
                <div className="text-[11px] font-bold tracking-[0.15em] text-white leading-tight">
                  THE INTERNATIONAL
                </div>
                <div className="text-[28px] font-black tracking-tight text-white leading-none">FOOTBALL</div>
                <div className="text-[28px] font-black tracking-tight text-white leading-none">GROUP</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="heading text-4xl text-white mb-4 leading-tight">
                Join The International
                <br />
                Football Group
              </h2>
              <p className="text-lg text-blue-200 leading-relaxed">
                Create your account and start managing player recruitment, tracking progress, and growing your academy.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Full access to CRM platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Manage unlimited players and campaigns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Advanced analytics and reporting</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Email automation and templates</p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="pt-6 mt-6 border-t border-white/20">
              <p className="text-sm text-blue-200 mb-3">Trusted by leading football academies worldwide</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-blue-200 mt-1">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-xs text-blue-200 mt-1">Academies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-xs text-blue-200 mt-1">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-sm text-blue-200">
            <p>© 2025 International Football Group</p>
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

        {/* Right side - Sign Up Form */}
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

              <div>
                <div className="mb-8">
                  <h2 className="heading text-3xl text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Start managing your football academy today</p>
                </div>

                <form onSubmit={handleSignUp} noValidate className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => setTouched({ ...touched, fullName: true })}
                        className={`pl-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all ${
                          touched.fullName && !validateFullName(fullName) ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                        aria-invalid={touched.fullName && !validateFullName(fullName)}
                        aria-describedby={
                          touched.fullName && !validateFullName(fullName) ? "fullName-error" : undefined
                        }
                      />
                    </div>
                    {touched.fullName && !validateFullName(fullName) && (
                      <p id="fullName-error" className="text-sm text-red-600 flex items-center gap-1.5">
                        <XCircle className="h-4 w-4" />
                        Please enter at least 2 characters
                      </p>
                    )}
                  </div>

                  {/* Email */}
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
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched({ ...touched, email: true })}
                        className={`pl-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all ${
                          touched.email && email && !validateEmail(email) ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                        aria-invalid={touched.email && email && !validateEmail(email)}
                        aria-describedby={touched.email && email && !validateEmail(email) ? "email-error" : undefined}
                      />
                    </div>
                    {touched.email && email && !validateEmail(email) && (
                      <p id="email-error" className="text-sm text-red-600 flex items-center gap-1.5">
                        <XCircle className="h-4 w-4" />
                        Please enter a valid email address
                      </p>
                    )}
                  </div>

                  {/* Password */}
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched({ ...touched, password: true })}
                        className="pl-10 pr-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all"
                        aria-describedby="password-strength"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {password && (
                      <div id="password-strength" className="space-y-2 pt-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                i < passwordStrength.score
                                  ? getPasswordStrengthColor(passwordStrength.score)
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{passwordStrength.feedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Repeat Password */}
                  <div className="space-y-2">
                    <Label htmlFor="repeat-password" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="repeat-password"
                        type={showRepeatPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        onBlur={() => setTouched({ ...touched, repeatPassword: true })}
                        className={`pl-10 pr-10 h-12 rounded-[10px] border-gray-300 focus:border-[#0A47B1] focus:ring-2 focus:ring-[#0A47B1] transition-all ${
                          touched.repeatPassword && repeatPassword && password !== repeatPassword
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        aria-invalid={touched.repeatPassword && repeatPassword && password !== repeatPassword}
                        aria-describedby={
                          touched.repeatPassword && repeatPassword && password !== repeatPassword
                            ? "repeat-password-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                      >
                        {showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {touched.repeatPassword && repeatPassword && (
                      <>
                        {password === repeatPassword ? (
                          <p className="text-sm text-green-600 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Passwords match
                          </p>
                        ) : (
                          <p id="repeat-password-error" className="text-sm text-red-600 flex items-center gap-1.5">
                            <XCircle className="h-4 w-4" />
                            Passwords do not match
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-shake">
                      <AlertCircle className="h-4 w-4" />
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
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500">
                        Already have an account?
                      </span>
                    </div>
                  </div>

                  <Link href="/auth/login">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium transition-all bg-transparent"
                    >
                      Sign in instead
                    </Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
