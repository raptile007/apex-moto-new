"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, Plane, Radio, Loader2, X } from "lucide-react"
import { useSound } from "@/hooks/use-sound"

type SatelliteTrackingProps = {
  isOpen: boolean
  onClose: () => void
}

export function SatelliteTracking({ isOpen, onClose }: SatelliteTrackingProps) {
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
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-4xl aspect-video glass-dark border border-white/10 rounded-[2rem] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Header HUD */}
            <div className="absolute top-0 inset-x-0 h-16 border-b border-white/5 flex items-center justify-between px-8 bg-white/5 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">SAT_LINK [ ESTABLISHED ]</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">MISSION_ID: AM-2024-X</span>
              </div>
              <button 
                onClick={() => { play('click'); onClose(); }}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tactical Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            {/* Map Simulation */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="relative w-[150%] h-[150%] bg-[#050505]">
                {/* Stylized Map Lines */}
                <svg className="absolute inset-0 w-full h-full stroke-white/5" fill="none">
                  <path d="M0,500 Q500,100 1000,500 T2000,500" strokeWidth="1" />
                  <path d="M0,300 Q400,600 900,300 T1800,300" strokeWidth="1" />
                  <circle cx="1000" cy="500" r="300" stroke="rgba(255, 77, 0, 0.1)" strokeWidth="2" strokeDasharray="10 5" />
                </svg>

                {/* Drone Animation */}
                <motion.div
                  initial={{ x: "20%", y: "70%" }}
                  animate={{ x: "80%", y: "30%" }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute z-20"
                >
                  <div className="relative">
                    <motion.div 
                      className="absolute -inset-4 bg-apex-orange/20 rounded-full blur-xl"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Plane className="w-8 h-8 text-apex-orange rotate-45" />
                    <div className="absolute top-10 left-10 w-48 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-md">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-apex-orange uppercase tracking-widest">ASSET_LOCATOR</span>
                        <span className="text-[10px] text-white font-mono uppercase tracking-tighter">SPD: 420 KM/H</span>
                        <span className="text-[10px] text-white font-mono uppercase tracking-tighter">ALT: 12,000 FT</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Destination */}
                <div className="absolute left-[80%] top-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div 
                    className="w-12 h-12 border-2 border-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-32 text-center">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">DROP_ZONE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom HUD */}
            <div className="absolute bottom-0 inset-x-0 h-24 border-t border-white/5 grid grid-cols-4 px-8 bg-[#0a0a0a]/80 backdrop-blur-xl">
              {[
                { label: "ETA_ARRIVAL", value: "14:42:00", unit: "ZULU" },
                { label: "FUEL_STATUS", value: "88", unit: "%" },
                { label: "HUMIDITY", value: "12", unit: "%" },
                { label: "WIND_SPEED", value: "14", unit: "KNOTS" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col justify-center gap-1 border-r border-white/5 last:border-0 px-4">
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-display font-black text-white italic tracking-tighter">{stat.value}</span>
                    <span className="text-[10px] font-bold text-apex-orange">{stat.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
