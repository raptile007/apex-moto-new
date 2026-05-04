'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Loader2, ArrowLeft, Check } from 'lucide-react'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [bikeType, setBikeType] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const bikeTypes = [
    { value: 'sport', label: 'Sport Bike' },
    { value: 'cruiser', label: 'Cruiser' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'touring', label: 'Touring' },
    { value: 'naked', label: 'Naked / Street' },
    { value: 'dirt', label: 'Dirt / Off-road' },
  ]

  const passwordRequirements = [
    { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
    { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
    { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  ]

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!passwordRequirements.every(req => req.test(password))) {
      setError('Password does not meet requirements')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            preferred_bike_type: bikeType,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-apex-orange/20 via-black to-black" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-apex-orange flex items-center justify-center">
              <span className="font-display font-bold text-white text-lg">A</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">APEXMOTO</span>
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join the Revolution
            </h1>
            <p className="text-white/70 text-lg max-w-md">
              Create your account and unlock access to premium motorcycle parts, exclusive deals, and a community of passionate riders.
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                'AI-powered parts recommendations',
                'Track orders in real-time',
                'Book service appointments',
                'Get notified when items are back in stock',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-apex-orange/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-apex-orange" />
                  </div>
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-white/40 text-sm">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                placeholder="John Rider"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                placeholder="rider@apexmoto.com"
              />
            </div>

            <div>
              <label htmlFor="bikeType" className="block text-sm font-medium text-foreground mb-2">
                Preferred Bike Type
              </label>
              <select
                id="bikeType"
                value={bikeType}
                onChange={(e) => setBikeType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground"
              >
                <option value="">Select your bike type</option>
                {bikeTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.test(password) ? 'bg-green-500' : 'bg-muted'}`}>
                      {req.test(password) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={req.test(password) ? 'text-green-500' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-apex-orange focus:ring-1 focus:ring-apex-orange outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                placeholder="Confirm your password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-apex-orange hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
