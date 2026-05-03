"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import Image from "next/image"

export function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    cartTotal, 
    removeFromCart, 
    updateCartQuantity,
    clearCart
  } = useStore()

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    toast.success("Order placed successfully!", {
      description: `Total: $${cartTotal.toFixed(2)}`
    })
    clearCart()
    setIsCartOpen(false)
  }

  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id)
    toast.info(`${name} removed from cart`)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] z-50 shadow-2xl flex flex-col border-l border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[#050505] relative">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-apex-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                   <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                   <h2 className="font-display font-black text-xl italic uppercase tracking-tighter text-white">BATTLE_READY_CART</h2>
                   <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">{cart.length} SYSTEMS DEPLOYED</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-dashed border-white/10">
                    <ShoppingCart className="w-10 h-10 text-neutral-700 mb-4" />
                  </div>
                  <h3 className="font-display font-black text-2xl italic uppercase tracking-tight text-white mb-4">CARGO_BAY_EMPTY</h3>
                  <p className="text-neutral-500 text-sm max-w-[200px] mx-auto font-medium leading-relaxed">Your tactical inventory is currently inactive. Select components for deployment.</p>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-6 p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-neutral-900 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10">
                        <Image src={item.image} alt={item.name} fill className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                           <h4 className="font-display font-black text-sm italic uppercase tracking-tight text-white group-hover:text-apex-orange transition-colors truncate">{item.name}</h4>
                           <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mt-1">{item.brand}</p>
                        </div>
                        <p className="font-display font-black italic text-lg text-white mt-4">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>

                        <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1 border border-white/5">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-6 text-center text-xs font-black italic text-white">{item.quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-8 border-t border-white/5 bg-[#050505] space-y-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">SUBTOTAL_VALUATION</span>
                  <span className="font-display font-black text-2xl italic text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                     <Button 
                       className="w-full h-14 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter text-base rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)]"
                       onClick={handleCheckout}
                     >
                       <ShoppingCart className="w-4 h-4 mr-2" />
                       FINALIZE BUILD & ADD TO CART
                     </Button>
                   </motion.div>
                   <Button 
                     variant="ghost" 
                     className="w-full h-12 text-[10px] font-black tracking-widest uppercase text-neutral-600 hover:text-white hover:bg-white/5 rounded-xl"
                     onClick={() => {
                       clearCart()
                       toast.info("Tactical inventory purged")
                     }}
                   >
                     PURGE ALL CARGO
                   </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
