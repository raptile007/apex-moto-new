"use client"

import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-24 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-[10px] font-black italic text-apex-orange tracking-[0.4em] uppercase mb-6 block">
              ABOUT US
            </span>
            <h2 className="text-4xl lg:text-6xl font-display font-black italic tracking-tighter uppercase mb-8 leading-[1.1]">
              <span className="text-white">MAKE YOUR DREAM COME TRUE &</span> <br />
              <span className="text-apex-orange">GROW WITH US</span>
            </h2>
            <div className="space-y-6 text-neutral-400 font-medium text-lg max-w-xl">
              <p>
                From India towards the Globe, we are available 24/7 to support our customers and guide them in a proper way to select the product range from individuals to large wholesalers.
              </p>
              <p>
                Our range of products include the very best brands in the Global market. Our stocks consist of inventory of parts covering the full range for all Royal Enfield Models like Cast Iron STD 350 and 500 CC&apos;s as well as the new UCE, EFI, TWINS Models & J Platform etc.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-12">
               <div>
                  <p className="text-4xl font-display font-black italic text-white mb-1">24/7</p>
                  <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase italic">GLOBAL SUPPORT</p>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div>
                  <p className="text-4xl font-display font-black italic text-white mb-1">100%</p>
                  <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase italic">GENUINE PARTS</p>
               </div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5">
               <Image 
                  src="/about-us.jpg" 
                  alt="About ApexMoto" 
                  fill
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-apex-orange/20 mix-blend-overlay" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               
               {/* Overlay Text */}
               <div className="absolute bottom-12 left-12">
                  <p className="text-7xl font-display font-black italic text-white leading-none mb-2">100%</p>
                  <p className="text-xl font-display font-black italic text-apex-orange uppercase tracking-tight">GENUINE COMPONENTS</p>
               </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-apex-orange/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-apex-orange/5 rounded-full blur-[80px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
