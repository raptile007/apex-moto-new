"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [cursorLabel, setCursorLabel] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 300 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest("button, a, [data-cursor]")
      
      if (interactive) {
        setIsHovering(true)
        const label = interactive.getAttribute("data-cursor")
        setCursorLabel(label)
      } else {
        setIsHovering(false)
        setCursorLabel(null)
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [cursorX, cursorY])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-apex-orange flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? "rgba(255, 77, 0, 0.1)" : "transparent",
        }}
        transition={{ duration: 0.15 }}
      >
        <AnimatePresence>
          {cursorLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black tracking-[0.2em] text-apex-orange bg-[#050505] px-2 py-1 rounded-sm border border-apex-orange/20 whitespace-nowrap uppercase italic"
            >
              {cursorLabel}
            </motion.span>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="w-1 h-1 bg-apex-orange rounded-full"
          animate={{ scale: isHovering ? 0 : 1 }}
        />
      </motion.div>
      
      {/* HUD Orbit */}
      <motion.div
        className="absolute top-0 left-0 w-12 h-12 border border-dashed border-apex-orange/30 rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: -8,
          translateY: -8,
        }}
        animate={{
          rotate: 360,
          scale: isHovering ? 1.2 : 0.8,
          opacity: isHovering ? 1 : 0,
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 }
        }}
      />
    </div>
  )
}
