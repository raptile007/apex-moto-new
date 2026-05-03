"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BikeBuilder } from "@/components/bike-builder"
import { ProductGrid } from "@/components/product-grid"
import { ProductModal } from "@/components/product-modal"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"
import { FeatureBanner } from "@/components/feature-banner"
import { motion, useScroll, useSpring } from "framer-motion"
import dynamic from "next/dynamic"

const ShopMap = dynamic(() => import("@/components/shop-map").then(mod => mod.ShopMap), { 
  ssr: false,
  loading: () => <div className="h-[700px] bg-white/5 animate-pulse rounded-[3rem]" />
})

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="min-h-screen bg-background selection:bg-apex-orange selection:text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-apex-orange z-[100] origin-left"
        style={{ scaleX }}
      />
      
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-12 bg-white/[0.02] border-y border-white/5">
           <div className="max-w-7xl mx-auto px-4 overflow-hidden">
              <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                 {["KTM", "HONDA", "YAMAHA", "BAJAJ", "TRIUMPH", "DUCATI", "APRILIA", "BMW"].map(brand => (
                   <span key={brand} className="text-4xl md:text-6xl font-display font-black text-white/10 italic tracking-tighter">{brand}</span>
                 ))}
              </div>
           </div>
        </section>

        <FeatureBanner />

        <BikeBuilder />

        <AboutSection />
        
        <div id="products">
          <ProductGrid />
        </div>
        
        <ShopMap />
      </main>
      
      <Footer />
      <ProductModal />
    </div>
  )
}

