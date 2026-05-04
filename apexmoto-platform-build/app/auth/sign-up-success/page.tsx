'use client'

import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="glass rounded-2xl p-8">
          <div className="w-20 h-20 rounded-full bg-apex-orange/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-apex-orange" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">Check Your Email</h1>
          
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to your email address. Click the link to activate your account and start exploring premium motorcycle parts.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-xl bg-apex-orange/10 border border-apex-orange/20">
              <p className="text-sm text-apex-orange">
                The confirmation link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full py-3 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full py-3 px-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
