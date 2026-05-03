"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, Heart, Menu, X, MapPin, User, Radio, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { CartDrawer } from "./cart-drawer"
import { SatelliteTracking } from "./satellite-tracking"
import { useSound } from "@/hooks/use-sound"

export function Header() {
  const { cartCount, setSearchQuery, searchQuery, setIsCartOpen, wishlist } = useStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const { play } = useSound()

  const navItems = [
    { label: "Shop", href: "#products" },
    { label: "Brakes", href: "#products?category=Brakes" },
    { label: "Engine", href: "#products?category=Engine" },
    { label: "Drive", href: "#products?category=Drive" },
    { label: "Tyres", href: "#products?category=Tyres" },
  ]

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-apex-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                  <span className="text-white font-black text-lg font-display italic">A</span>
                </div>
                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic hidden sm:block">Apex<span className="text-apex-orange">Moto</span></span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { label: "SHOP", href: "#products" },
                { label: "BUILDER", href: "#builder" },
                { label: "MECHANICS", href: "#mechanics" },
              ].map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-[10px] font-black tracking-[0.2em] text-neutral-400 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-apex-orange transition-all group-hover:w-full" />
                </motion.a>
              ))}
            </nav>

            {/* Search Bar */}
            <motion.div 
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
              animate={{ 
                scale: isSearchFocused ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="SEARCH PERFORMANCE PARTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 h-12 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-apex-orange/50 text-white text-xs font-bold transition-all placeholder:text-neutral-600 tracking-wider"
                />
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/5 hover:text-apex-orange" asChild>
                  <Link href="#mechanics">
                    <MapPin className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                  onClick={() => { play('scan'); setIsTrackingOpen(true); }}
                  data-cursor="TRACK"
                >
                  <Radio className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                  asChild
                >
                  <a href="https://github.com/raptile007/apex-moto-new" target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                  asChild
                >
                  <Link href="/admin">
                    <User className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-apex-orange rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#ff4d00]" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange group"
                >
                  <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <AnimatePresence>
                    {wishlist.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="w-4 h-4 p-0 flex items-center justify-center text-[8px] font-black bg-white text-black border-2 border-[#050505]">
                          {wishlist.length}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-white hover:bg-white/5 hover:text-apex-orange"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="w-5 h-5 p-0 flex items-center justify-center text-[10px] font-black bg-apex-orange text-white border-2 border-[#050505]">
                          {cartCount}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="lg:hidden">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-white/5 bg-[#050505] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <Input
                    type="text"
                    placeholder="Search performance parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 h-12 bg-white/5 border-white/10 rounded-xl text-white text-xs"
                  />
                </div>

                {/* Mobile Nav Items */}
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-xs font-black tracking-widest text-neutral-400 hover:bg-white/5 hover:text-apex-orange transition-all uppercase"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-xs font-black tracking-widest text-neutral-400 hover:bg-white/5 hover:text-apex-orange transition-all uppercase"
                    >
                      APEX_COMMAND [ ADMIN ]
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CartDrawer />
      <SatelliteTracking isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
    </>
  )
}
