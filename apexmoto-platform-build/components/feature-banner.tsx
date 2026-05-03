"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"

export function FeatureBanner() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="/feature-banner.jpg" 
          alt="Performance Air Filter" 
          fill
          priority
          className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black italic text-apex-orange tracking-[0.4em] uppercase mb-6 block">
              ENGINE OPTIMIZATION
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black italic tracking-tighter text-white uppercase mb-6 leading-tight">
              &ldquo;THE QUALITY OF AIR FILTER DETERMINES YOUR BIKE&apos;S <span className="text-apex-orange">EFFICIENCY & POWER DELIVERY</span>. <br />
              GET YOURS FROM <span className="text-apex-orange">NGAGE POWERPARTS</span>&rdquo;
            </h2>
            <div className="mb-10">
               <Button 
                asChild
                className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-10 h-12 rounded-none shadow-[0_0_30px_rgba(255,77,0,0.3)] cursor-pointer"
               >
                  <a href="#products">SHOP NOW</a>
               </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Badge Overlay (Right side similar to screenshot) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute right-20 bottom-20 hidden lg:flex flex-col items-center justify-center w-48 h-48 border border-white/10 rounded-full backdrop-blur-md bg-white/5"
      >
        <div className="text-center">
           <p className="text-[8px] font-black tracking-widest text-neutral-500 uppercase italic mb-1">CERTIFIED</p>
           <p className="text-2xl font-display font-black italic text-white leading-tight uppercase">EXCELLENT<br />QUALITY</p>
           <p className="text-[8px] font-black tracking-widest text-neutral-500 uppercase italic mt-1">ENGINEERED SPECS</p>
        </div>
        
        {/* Animated outer ring */}
        <div className="absolute inset-0 border-2 border-dashed border-apex-orange/30 rounded-full animate-[spin_20s_linear_infinite]" />
      </motion.div>
      
      {/* Background large text overlay */}
      <div className="absolute -bottom-10 right-0 pointer-events-none select-none opacity-5">
         <h3 className="text-[20rem] font-display font-black italic text-white leading-none">AIR</h3>
      </div>
    </section>
  )
}
