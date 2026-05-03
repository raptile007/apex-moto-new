"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Cpu, Zap, Activity } from "lucide-react"
import { useStore } from "@/lib/store"
import { useSound } from "@/hooks/use-sound"

export function ApexAI() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { selectedParts, cart } = useStore()
  const { play } = useSound()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Logic for AI suggestions
    if (Object.keys(selectedParts).length > 0) {
      const categories = Object.keys(selectedParts)
      if (categories.includes("Engine") && !categories.includes("Electronics")) {
        setMessage("I detect engine upgrades. Consider the ApexVision TFT Speedo for advanced telemetry sync.")
      } else if (categories.includes("Drive") && cart.length > 0) {
        setMessage("Mission profile looks aggressive. Ensure drive components are properly lubricated with our Synthetic 4T oil.")
      } else {
        setMessage("Configuration looks optimal. Proceed with deployment.")
      }
    } else {
      setMessage("Systems online. Ready to optimize your motorcycle loadout.")
    }
  }, [selectedParts, cart])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    play(isOpen ? 'click' : 'scan')
  }

  if (!isMounted) return null

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72 glass-dark border border-apex-orange/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(255,77,0,0.1)] relative overflow-hidden"
          >
            {/* HUD Scan Line */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-apex-orange/5 to-transparent h-20 w-full"
              animate={{ y: [0, 200] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-apex-orange rounded-full animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-apex-orange uppercase">APEX_AI [ ACTIVE ]</span>
            </div>

            <p className="text-xs text-neutral-300 font-medium leading-relaxed mb-4 relative z-10">
              {message}
            </p>

            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] text-neutral-500 font-black uppercase tracking-widest">SIGNAL_STRENGTH</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-1 rounded-full ${i < 5 ? 'bg-apex-orange' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleOpen}
        data-cursor="ASSIST"
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
          isOpen 
            ? "bg-apex-orange border-apex-orange shadow-[0_0_30px_rgba(255,77,0,0.4)]" 
            : "bg-[#050505] border-white/10 text-apex-orange hover:border-apex-orange/50 shadow-xl"
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Cpu className="w-6 h-6" />}
      </motion.button>
    </div>
  )
}
