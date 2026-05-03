"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { type Product } from "@/lib/data"
import { toast } from "sonner"
import { useSound } from "@/hooks/use-sound"
import Image from "next/image"

type ProductCardProps = {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useStore()
  const { play } = useSound()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    if (product.stockStatus === "Backorder") {
      play('beep')
      toast.info(`${product.name} is on backorder`, {
        description: "Unit will ship once production batch is ready."
      })
    } else {
      addToCart(product)
      play('success')
      toast.success(`${product.name} added to cart`)
    }
  }

  const handleToggleWishlist = () => {
    toggleWishlist(product.id)
    play('click')
    if (inWishlist) {
      toast.info(`Removed from wishlist`)
    } else {
      toast.success(`Added to wishlist`)
    }
  }

  const handleViewDetails = () => {
    setSelectedProduct(product)
    play('scan')
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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      data-cursor="ANALYZER"
      className="group"
    >
      <div className="relative bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden backdrop-blur-sm hover:border-apex-orange/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,77,0,0.1)] hover:-translate-y-2">
        {/* Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
          {/* Stock Badge */}
          <div className="absolute top-5 left-5 z-20">
            <Badge className={`font-black italic text-[8px] tracking-widest uppercase px-3 py-1 rounded-full ${
              product.stockStatus === "In Stock" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
              product.stockStatus === "Low Stock" ? "bg-apex-orange/10 text-apex-orange border border-apex-orange/20 shadow-[0_0_10px_rgba(255,77,0,0.1)]" :
              "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}>
              {product.stockStatus}
            </Badge>
          </div>

          {/* Sale Badge */}
          {product.originalPrice && (
            <div className="absolute top-5 right-5 z-20">
              <Badge className="bg-apex-orange text-white border-0 font-black italic text-[9px] tracking-widest uppercase px-3 py-1 shadow-[0_0_15px_rgba(255,77,0,0.3)]">
                SALE
              </Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`absolute bottom-5 right-5 z-20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
              inWishlist 
                ? "bg-apex-orange border-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]" 
                : "bg-black/50 backdrop-blur-md border-white/10 text-white hover:bg-white/10"
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
          </motion.button>

          {/* Product Image */}
          <motion.div 
            className="w-full h-full"
            whileHover={{ scale: 1.1, rotate: -2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="w-full h-full object-cover group-hover:opacity-60 transition-opacity duration-500"
            />
          </motion.div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-black/80 to-transparent">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                size="icon" 
                variant="outline"
                className="w-14 h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setSelectedProduct(product)}
              >
                <Eye className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black italic text-apex-orange uppercase tracking-[0.2em]">
              {product.brand}
            </span>
            <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest italic">{product.category}</span>
          </div>

          {/* Name */}
          <h3 className="font-display font-black text-lg italic uppercase tracking-tight leading-tight line-clamp-2 h-14 group-hover:text-apex-orange transition-colors">
            {product.name}
          </h3>

          <p className="text-[10px] text-neutral-500 font-medium line-clamp-2 leading-relaxed">
             {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="font-display font-black italic text-2xl tracking-tighter text-white">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-600 line-through font-black italic tracking-tighter">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className={`w-full h-12 rounded-2xl font-black italic text-[10px] tracking-widest uppercase gap-3 transition-all ${
                product.stockStatus === "Backorder" 
                ? "bg-white/5 border border-white/10 text-neutral-500 cursor-not-allowed" 
                : "bg-white text-black hover:bg-apex-orange hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              }`}
              onClick={handleAddToCart}
              disabled={product.stockStatus === "Backorder"}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.stockStatus === "Backorder" ? "OUT OF STOCK" : "ACQUIRE UNIT"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
