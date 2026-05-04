'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">
            There was a problem with your authentication request. This could be due to an expired or invalid link.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full py-3 px-4 bg-apex-orange text-white font-semibold rounded-xl hover:bg-apex-orange/90 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="w-full py-3 px-4 glass text-foreground font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
