"use client"

import { useCallback, useEffect, useRef } from 'react'

const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  beep: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  scan: 'https://assets.mixkit.co/active_storage/sfx/2565/2565-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  delete: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
}

export function useSound() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url)
      audio.preload = 'auto'
      audio.volume = 0.1
      audioRefs.current[key] = audio
    })
  }, [])

  const play = useCallback((sound: keyof typeof SOUNDS) => {
    const audio = audioRefs.current[sound]
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }, [])

  return { play }
}
