"use client"

import { motion } from "framer-motion"

export function SkeletonHUD() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden relative group">
          {/* Scanning Line */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-apex-orange/5 to-transparent h-40 w-full"
            animate={{ y: [-200, 600] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 gap-4">
            <div className="w-2/3 h-4 bg-white/10 rounded-full" />
            <div className="w-1/2 h-4 bg-white/5 rounded-full" />
            <div className="flex justify-between items-center mt-4">
              <div className="w-20 h-6 bg-white/10 rounded-full" />
              <div className="w-10 h-10 bg-white/5 rounded-xl" />
            </div>
          </div>

          {/* Wireframe Corner */}
          <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-white/10" />
          <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-white/10" />
        </div>
      ))}
    </div>
  )
}
