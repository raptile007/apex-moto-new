'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  LogOut, 
  Package, 
  Calendar, 
  Heart, 
  Bell, 
  Settings,
  ChevronDown,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export function UserMenu() {
  const { user, profile, isLoading, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsOpen(false)
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="text-white" disabled>
        <Loader2 className="w-5 h-5 animate-spin" />
      </Button>
    )
  }

  if (!user) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
          asChild
        >
          <Link href="/auth/login">
            <User className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-apex-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#ff4d00]" />
          </Link>
        </Button>
      </motion.div>
    )
  }

  const menuItems = [
    { icon: Package, label: 'My Orders', href: '/account/orders' },
    { icon: Calendar, label: 'Bookings', href: '/account/bookings' },
    { icon: Heart, label: 'Wishlist', href: '/account/wishlist' },
    { icon: Bell, label: 'Stock Alerts', href: '/account/alerts' },
    { icon: Settings, label: 'Settings', href: '/account/settings' },
  ]

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-apex-orange flex items-center justify-center">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={profile.avatar_url} 
              alt="" 
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            <span className="text-white font-bold text-sm">
              {(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-semibold text-white truncate max-w-[100px]">
            {profile?.full_name || 'Rider'}
          </div>
          <div className="text-[10px] text-muted-foreground truncate max-w-[100px]">
            {user.email}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass border border-white/10 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-apex-orange flex items-center justify-center">
                    {profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={profile.avatar_url} 
                        alt="" 
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {(profile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {profile?.full_name || 'Rider'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                    {profile?.preferred_bike_type && (
                      <div className="text-[10px] text-apex-orange uppercase tracking-wider mt-1">
                        {profile.preferred_bike_type} Rider
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-white/5 hover:text-apex-orange transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Sign Out */}
              <div className="p-2 border-t border-white/10">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
