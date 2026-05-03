"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Zap, Shield, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"

export function Hero() {
  const containerRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#050505]">
      {/* Background Image with Overlay */}
      {isMounted && (
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" 
            alt="Premium Motorcycle Parts" 
            fill 
            className="object-cover opacity-60 scale-110 blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </motion.div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Trophy className="w-3 h-3" />
              Engineered for Champions
            </div>
            <h1 className="text-6xl lg:text-9xl font-display font-bold leading-[0.85] tracking-tighter text-white uppercase italic">
              Level Up
              <br />
              <span className="text-apex-orange drop-shadow-[0_0_30px_rgba(255,77,0,0.4)]">Performance</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-xl font-medium leading-relaxed"
          >
            Unleash the full potential of your machine. Precision components for KTM, Honda, Yamaha, and Bajaj. Built for those who live on the edge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button size="lg" className="h-16 px-10 bg-apex-orange hover:bg-apex-orange/90 text-white rounded-none font-display font-black italic text-lg tracking-tighter group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-2">
                SHOP COLLECTION
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Button>
            
            <Button variant="outline" size="lg" className="h-16 px-10 border-white/10 hover:bg-white/5 text-white rounded-none font-display font-bold italic text-lg tracking-tighter transition-all hover:border-apex-orange/50">
              CUSTOM BUILDER
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-white/5"
          >
            {[
              { icon: Zap, label: "0.1s", sub: "Response Time" },
              { icon: Shield, label: "5yr", sub: "Warranty" },
              { icon: Trophy, label: "100+", sub: "Podiums" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-apex-orange">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-2xl font-display font-black italic">{stat.label}</span>
                </div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{stat.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/2 h-full pointer-events-none hidden lg:block">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-apex-orange/20 rounded-full blur-[120px] animate-pulse" />
      </div>
    </section>
  )
}

