"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Scan, Box, X, Target } from "lucide-react"
import { useSound } from "@/hooks/use-sound"
import { Button } from "./ui/button"

type ARPreviewProps = {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

export function ARPreview({ isOpen, onClose, productName }: ARPreviewProps) {
  const { play } = useSound()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl bg-[#050505] border border-apex-orange/30 rounded-[2rem] overflow-hidden relative shadow-[0_0_100px_rgba(255,77,0,0.2)]"
          >
            {/* AR Viewport Placeholder */}
            <div className="aspect-square relative bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
              {/* HUD Frame */}
              <div className="absolute inset-8 border border-white/5 pointer-events-none" />
              <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-apex-orange" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-apex-orange" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-apex-orange" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-apex-orange" />

              {/* Center Target */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Target className="w-32 h-32 text-apex-orange/20" strokeWidth={1} />
              </motion.div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 bg-apex-orange/10 rounded-full flex items-center justify-center mb-6"
                >
                  <Box className="w-10 h-10 text-apex-orange" />
                </motion.div>
                <h3 className="font-display font-black text-3xl italic uppercase text-white mb-2">INITIALIZING_AR</h3>
                <p className="text-neutral-500 text-sm max-w-xs font-medium">Scanning surface for {productName || "unit"} deployment. Ensure adequate lighting in your tactical environment.</p>
              </div>

              {/* Data Stream */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-apex-orange"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-neutral-600 uppercase">SYS_{i}0{i}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="p-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">DEPLOYMENT_MODE</span>
                <span className="text-sm text-white font-black italic uppercase">GARAGE_SIMULATION_v1.0</span>
              </div>
              <Button 
                onClick={() => { play('click'); onClose(); }}
                className="bg-white text-black font-black italic uppercase tracking-tighter px-8 h-12 rounded-xl hover:bg-neutral-200"
              >
                TERMINATE SESSION
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
