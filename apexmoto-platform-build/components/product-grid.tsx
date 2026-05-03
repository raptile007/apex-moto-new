"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Filter, X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { ProductCard } from "./product-card"
import { useState, useEffect } from "react"
import { useSound } from "@/hooks/use-sound"
import { SkeletonHUD } from "./skeleton-hud"

const categories = ["Brakes", "Engine", "Drive", "Tyres"] as const
const brands = ["KTM", "Honda", "Yamaha", "Bajaj"] as const

export function ProductGrid() {
  const { 
    filteredProducts, 
    selectedCategory, 
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    searchQuery
  } = useStore()

  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const activeFiltersCount = [selectedCategory, selectedBrand].filter(Boolean).length

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedBrand(null)
  }

  return (
    <section id="products" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-apex-orange/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-apex-orange/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <Badge className="bg-apex-orange/10 text-apex-orange border-apex-orange/20 font-black italic tracking-widest uppercase px-4 py-1 mb-6">
            ENGINEERED FOR SPEED
          </Badge>
          <h2 className="text-5xl lg:text-7xl font-display font-black italic tracking-tighter mb-6 uppercase">
            Performance <span className="text-apex-orange text-glow">Arsenal</span>
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto font-medium text-lg">
            Uncompromising components for the elite rider. Every part is a tactical advantage.
          </p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Desktop Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black tracking-[0.3em] text-neutral-600 uppercase mr-4">SECTOR_SELECT:</span>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-xl px-6 h-11 font-black italic text-[10px] tracking-widest uppercase transition-all ${
                  selectedCategory === null ? "bg-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] border-apex-orange" : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                ALL_SYSTEMS
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`rounded-xl px-6 h-11 font-black italic text-[10px] tracking-widest uppercase transition-all ${
                    selectedCategory === category ? "bg-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] border-apex-orange" : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black tracking-[0.3em] text-neutral-600 uppercase mr-4">BRAND_FILTER:</span>
              {brands.map((brand) => (
                <Button
                  key={brand}
                  variant={selectedBrand === brand ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)}
                  className={`rounded-xl px-6 h-11 font-black italic text-[10px] tracking-widest uppercase transition-all ${
                    selectedBrand === brand ? "bg-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)] border-apex-orange" : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {brand}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {(selectedCategory || selectedBrand || searchQuery) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5"
              >
                <span className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">ACTIVE_FILTERS:</span>
                {selectedCategory && (
                  <Badge className="bg-apex-orange/10 text-apex-orange border border-apex-orange/20 px-3 py-1.5 rounded-full text-[10px] font-black italic gap-2">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="hover:text-white"><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge className="bg-apex-orange/10 text-apex-orange border border-apex-orange/20 px-3 py-1.5 rounded-full text-[10px] font-black italic gap-2">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand(null)} className="hover:text-white"><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge className="bg-apex-orange/10 text-apex-orange border border-apex-orange/20 px-3 py-1.5 rounded-full text-[10px] font-black italic">
                    SEARCH: {searchQuery}
                  </Badge>
                )}
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-black tracking-widest text-apex-orange hover:text-white transition-colors ml-4 uppercase underline decoration-apex-orange/30 underline-offset-4"
                >
                  [ CLEAR_ALL ]
                </button>
                <span className="text-[10px] font-black tracking-widest text-neutral-600 uppercase ml-auto">
                  {filteredProducts.length} UNITS DETECTED
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonHUD />
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-white/5 border border-white/10 rounded-[3rem] border-dashed"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Filter className="w-10 h-10 text-neutral-700" />
              </div>
              <h3 className="font-display font-black text-2xl italic uppercase tracking-tight mb-3">No systems detected</h3>
              <p className="text-neutral-500 mb-8 max-w-sm mx-auto">Your tactical filters returned zero results. Reconfigure parameters and try again.</p>
              <Button onClick={clearFilters} className="bg-white text-black font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl hover:bg-neutral-200">
                RESET ALL PARAMETERS
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
