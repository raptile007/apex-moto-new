"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Heart, Check, Package, Truck, Shield, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import { ARPreview } from "./ar-preview"
import { useState } from "react"
import { useSound } from "@/hooks/use-sound"

export function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, isInWishlist } = useStore()
  const [isAROpen, setIsAROpen] = useState(false)
  const { play } = useSound()

  if (!selectedProduct) return null

  const inWishlist = isInWishlist(selectedProduct.id)

  const handleAddToCart = () => {
    if (selectedProduct.stockStatus === "Backorder") {
      toast.info(`${selectedProduct.name} is on backorder`)
    } else {
      addToCart(selectedProduct)
      toast.success(`${selectedProduct.name} added to cart`)
    }
  }

  const handleToggleWishlist = () => {
    toggleWishlist(selectedProduct.id)
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist")
  }

  const stockStatusColor = {
    "In Stock": "bg-emerald-100 text-emerald-700",
    "Low Stock": "bg-amber-100 text-amber-700",
    "Backorder": "bg-red-100 text-red-700"
  }

  const categoryEmoji = {
    "Brakes": "🛑",
    "Engine": "⚙️",
    "Drive": "⛓️",
    "Tyres": "🛞"
  }

  return (
    <AnimatePresence>
      {selectedProduct && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[3rem] z-[101] overflow-hidden shadow-[0_0_100px_rgba(255,77,0,0.2)]"
          >
            <div className="h-full overflow-y-auto hide-scrollbar">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-white"
              >
                <X className="w-6 h-6" />
              </motion.button>

              <div className="grid md:grid-cols-2 h-full">
                {/* Image Section */}
                <div className="relative aspect-square md:aspect-auto bg-[#050505] flex items-center justify-center p-0 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-apex-orange/10 to-transparent opacity-30" />
                   <motion.img 
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                   />

                  {/* Badges */}
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <Badge className={`font-black italic text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full ${
                      selectedProduct.stockStatus === "In Stock" ? "bg-emerald-500 text-white" :
                      selectedProduct.stockStatus === "Low Stock" ? "bg-apex-orange text-white" :
                      "bg-red-500 text-white"
                    }`}>
                      {selectedProduct.stockStatus}
                    </Badge>
                    {selectedProduct.originalPrice && (
                      <Badge className="bg-white text-black border-0 font-black italic text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full">
                        {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% DISCOUNT
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10 lg:p-14 space-y-8 flex flex-col justify-center bg-[#0a0a0a]">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black italic text-apex-orange uppercase tracking-[0.3em]">
                        {selectedProduct.brand}
                      </span>
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{selectedProduct.category}</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-black italic tracking-tighter mb-6 uppercase leading-none">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-neutral-400 leading-relaxed text-lg font-medium">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-display font-black italic tracking-tighter text-white">${selectedProduct.price.toFixed(2)}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-2xl text-neutral-600 line-through font-black italic tracking-tighter">
                        ${selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4">
                    <h3 className="text-[10px] font-black italic tracking-widest text-neutral-500 uppercase">
                      SYSTEM_SPECIFICATIONS
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <dt className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">{key}</dt>
                          <dd className="text-sm font-black italic text-white uppercase">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-6 text-[10px] font-black italic tracking-widest uppercase text-neutral-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <Check className="w-5 h-5 text-apex-orange" />
                      </div>
                      <span>OEM_SPEC</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <Truck className="w-5 h-5 text-apex-orange" />
                      </div>
                      <span>PRIORITY_LOGISTICS</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <Shield className="w-5 h-5 text-apex-orange" />
                      </div>
                      <span>COMBAT_WARRANTY</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button 
                        className={`w-full h-16 rounded-2xl font-black italic text-xs tracking-[0.2em] uppercase gap-4 transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] ${
                          selectedProduct.stockStatus === "Backorder" 
                          ? "bg-white/5 border border-white/10 text-neutral-600 cursor-not-allowed" 
                          : "bg-white text-black hover:bg-apex-orange hover:text-white"
                        }`}
                        onClick={handleAddToCart}
                        disabled={selectedProduct.stockStatus === "Backorder"}
                      >
                        <ShoppingCart className="w-6 h-6" />
                        {selectedProduct.stockStatus === "Backorder" ? "SIGNAL_AVAILABILITY" : "ACQUIRE UNIT"}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline"
                        size="icon"
                        className="w-16 h-16 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => { play('scan'); setIsAROpen(true); }}
                        data-cursor="AR_VIEW"
                      >
                        <Box className="w-6 h-6" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline"
                        size="icon"
                        className={`w-16 h-16 rounded-2xl border-white/10 bg-white/5 transition-all ${inWishlist ? "bg-apex-orange border-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]" : "text-white hover:bg-white/10"}`}
                        onClick={handleToggleWishlist}
                      >
                        <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <ARPreview isOpen={isAROpen} onClose={() => setIsAROpen(false)} productName={selectedProduct.name} />
        </>
      )}
    </AnimatePresence>
  )
}
