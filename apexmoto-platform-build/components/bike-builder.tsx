"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { bikes, products, type Bike, type Product } from "@/lib/data"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Check, Plus, ShoppingCart, Trash2, ChevronRight, Bike as BikeIcon, Share2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useSound } from "@/hooks/use-sound"

export function BikeBuilder() {
  const { addToCart, setIsCartOpen, selectedParts, setSelectedParts } = useStore()
  const { play } = useSound()
  const [selectedBike, setSelectedBike] = useState<Bike>(bikes[0])
  const [activeCategory, setActiveCategory] = useState<string>("Brakes")
  const [isMounted, setIsMounted] = useState(false)

  const handleShare = () => {
    const config = {
      bike: selectedBike.id,
      parts: Object.values(selectedParts).map(p => p.id).join(',')
    }
    const url = new URL(window.location.href)
    url.searchParams.set('loadout', btoa(JSON.stringify(config)))
    navigator.clipboard.writeText(url.toString())
    play('success')
    toast.success("MISSION_LOADOUT EXPORTED", {
      description: "Configuration link copied to clipboard."
    })
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const categories = ["Brakes", "Engine", "Drive", "Tyres"]

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === activeCategory)
  }, [activeCategory])

  const totalPrice = useMemo(() => {
    const partsTotal = Object.values(selectedParts).reduce((sum, p) => sum + p.price, 0)
    return selectedBike.basePrice + partsTotal
  }, [selectedBike, selectedParts])

  const handleAddPart = (product: Product) => {
    setSelectedParts(prev => ({
      ...prev,
      [product.category]: product
    }))
  }

  const handleRemovePart = (category: string) => {
    setSelectedParts(prev => {
      const newParts = { ...prev }
      delete newParts[category]
      return newParts
    })
  }

  const handleAddToCart = () => {
    // Add the base bike as a product
    const bikeProduct: Product = {
      id: selectedBike.id,
      name: `${selectedBike.name} (BASE_CHASSIS)`,
      brand: selectedBike.brand,
      category: "Engine",
      price: selectedBike.basePrice,
      description: `Base performance configuration for ${selectedBike.name}`,
      image: selectedBike.image,
      stock: 1,
      stockStatus: "In Stock",
      specs: { Model: selectedBike.model, Year: selectedBike.year }
    }
    
    addToCart(bikeProduct)
    
    // Add all selected upgrades
    Object.values(selectedParts).forEach(part => {
      addToCart(part)
    })

    play('success')
    toast.success("FULL_LOADOUT DEPLOYED", {
      description: `${selectedBike.name} with ${Object.keys(selectedParts).length} tactical upgrades added to cart.`
    })
    setIsCartOpen(true)
  }

  return (
    <section id="builder" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left: Bike Visual & Summary */}
          <div className="lg:w-1/2 space-y-8">
            <div className="sticky top-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-orange/10 border border-apex-orange/20 text-apex-orange text-[10px] font-black uppercase tracking-widest mb-6">
                <BikeIcon className="w-3 h-3" />
                Custom Build Studio
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-display font-bold text-white uppercase italic leading-none mb-8">
                Build Your <br /><span className="text-apex-orange">Dream Machine</span>
              </h2>

              <div className="relative aspect-video rounded-3xl overflow-hidden glass-dark border border-white/5 mb-8 group">
                <Image 
                  src={selectedBike.image}
                  alt={selectedBike.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Visual Hotspots (Glowing Indicators) */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {/* Brakes Zone */}
                  <AnimatePresence>
                    {selectedParts["Brakes"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-[60%] left-[25%] flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-apex-orange rounded-full animate-ping absolute" />
                        <div className="w-4 h-4 bg-apex-orange rounded-full relative shadow-[0_0_20px_#ff4d00]" />
                        <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-apex-orange/30">
                           <p className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{selectedParts["Brakes"].name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Engine Zone */}
                  <AnimatePresence>
                    {selectedParts["Engine"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-[45%] left-[50%] flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-apex-orange rounded-full animate-ping absolute" />
                        <div className="w-4 h-4 bg-apex-orange rounded-full relative shadow-[0_0_20px_#ff4d00]" />
                        <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-apex-orange/30">
                           <p className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{selectedParts["Engine"].name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Drive Zone */}
                  <AnimatePresence>
                    {selectedParts["Drive"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-[55%] left-[70%] flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-apex-orange rounded-full animate-ping absolute" />
                        <div className="w-4 h-4 bg-apex-orange rounded-full relative shadow-[0_0_20px_#ff4d00]" />
                        <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-apex-orange/30">
                           <p className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{selectedParts["Drive"].name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tyres Zone */}
                  <AnimatePresence>
                    {selectedParts["Tyres"] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute top-[70%] left-[80%] flex flex-col items-center"
                      >
                        <div className="w-4 h-4 bg-apex-orange rounded-full animate-ping absolute" />
                        <div className="w-4 h-4 bg-apex-orange rounded-full relative shadow-[0_0_20px_#ff4d00]" />
                        <div className="mt-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-apex-orange/30">
                           <p className="text-[8px] font-black text-white whitespace-nowrap uppercase tracking-widest">{selectedParts["Tyres"].name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="glass-dark rounded-3xl p-8 border border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] mb-1">Total Configuration</p>
                    <h3 className="text-3xl font-display font-black text-white italic">
                      ₹{isMounted ? totalPrice.toLocaleString('en-IN') : totalPrice}
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleShare}
                      data-cursor="EXPORT"
                      className="h-14 px-6 border-white/10 hover:bg-white/5 text-white rounded-xl font-bold gap-3 uppercase tracking-tighter"
                    >
                      <Share2 className="w-4 h-4" />
                      EXPORT
                    </Button>
                    <Button 
                      onClick={handleAddToCart}
                      disabled={Object.keys(selectedParts).length === 0}
                      data-cursor="LOCK_IN"
                      className="h-14 px-8 bg-apex-orange hover:bg-apex-orange/90 text-white rounded-xl font-bold gap-3 shadow-lg shadow-apex-orange/20 uppercase tracking-tighter"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      FINALIZE BUILD & ADD TO CART
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {Object.entries(selectedParts).map(([cat, part]) => (
                    <div key={cat} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                      <span className="text-[9px] font-black text-apex-orange uppercase tracking-widest">{cat}</span>
                      <span className="text-xs text-white font-medium">{part.name}</span>
                      <button onClick={() => handleRemovePart(cat)} className="text-neutral-500 hover:text-white">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection Interface */}
          <div className="lg:w-1/2 space-y-8">
            {/* Bike Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest">1. Select Base Model</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bikes.map(bike => (
                  <button
                    key={bike.id}
                    onClick={() => setSelectedBike(bike)}
                    data-cursor="SELECT"
                    className={`relative p-5 rounded-[2rem] border-2 transition-all text-left group overflow-hidden ${
                      selectedBike.id === bike.id 
                        ? "bg-apex-orange/10 border-apex-orange shadow-[0_0_30px_rgba(255,77,0,0.15)]" 
                        : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="relative z-10">
                       <div className="text-sm font-black text-white mb-1 uppercase tracking-tight italic">{bike.name}</div>
                       <div className="text-[10px] text-neutral-500 uppercase font-black tracking-widest italic">BASE_VAL: ₹{isMounted ? bike.basePrice.toLocaleString('en-IN') : bike.basePrice}</div>
                    </div>
                    
                    {selectedBike.id === bike.id && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-apex-orange text-white px-2 py-1 rounded-lg shadow-lg"
                      >
                        <Check className="w-3 h-3 font-black" />
                        <span className="text-[8px] font-black uppercase tracking-widest">SELECTED</span>
                      </motion.div>
                    )}

                    {/* Subtle Background Glow for active state */}
                    {selectedBike.id === bike.id && (
                       <div className="absolute inset-0 bg-gradient-to-br from-apex-orange/20 via-transparent to-transparent pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Part Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-500 uppercase tracking-widest">2. Customize Components</h3>
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto hide-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? "bg-apex-orange text-white shadow-lg shadow-apex-orange/20" 
                        : "text-neutral-500 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 mt-6">
                {filteredProducts.map(product => (
                  <motion.div
                    layout
                    key={product.id}
                    data-cursor="SELECT"
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                      selectedParts[activeCategory]?.id === product.id
                        ? "bg-apex-orange/5 border-apex-orange/50"
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 relative">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{product.name}</div>
                        <div className="text-xs text-apex-orange font-black italic">+₹{isMounted ? product.price.toLocaleString('en-IN') : product.price}</div>
                      </div>
                    </div>
                    
                    {selectedParts[activeCategory]?.id === product.id ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleRemovePart(activeCategory)} 
                          className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="w-10 h-10 bg-apex-orange rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.4)]">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </motion.div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleAddPart(product)}
                        className="w-10 h-10 bg-white/5 hover:bg-apex-orange text-white transition-all rounded-xl border border-white/10 group-hover:border-apex-orange/50"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
