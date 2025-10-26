'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image, Video } from 'lucide-react'
import { useMode } from '@/components/providers/ThemeProvider'
import { DetectionMode, getModeColors } from '@/lib/utils'
import { cn } from '@/lib/utils'

const modes: Array<{
  id: DetectionMode
  name: string
  icon: React.ElementType
  description: string
}> = [
  {
    id: 'text',
    name: 'Text',
    icon: FileText,
    description: 'Detect AI-generated text',
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    description: 'Detect AI-generated images',
  },
  {
    id: 'video',
    name: 'Video',
    icon: Video,
    description: 'Detect AI-generated videos',
  },
]

export function ModeTiles() {
  const { mode, setMode, isDark } = useMode()
  const [isAnimating, setIsAnimating] = React.useState(false)

  const handleModeClick = (newMode: DetectionMode) => {
    if (mode === newMode || isAnimating) return

    setIsAnimating(true)
    
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      setMode(newMode)
    })

    // Match the optimized transition duration (250ms on mobile, 400ms on desktop)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const duration = isMobile ? 250 : 400
    
    setTimeout(() => {
      setIsAnimating(false)
    }, duration)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-5xl mx-auto px-4">
      {modes.map((modeItem) => {
        const isActive = mode === modeItem.id
        const Icon = modeItem.icon

        return (
          <motion.button
            key={modeItem.id}
            onClick={() => handleModeClick(modeItem.id)}
            className={cn(
              'relative group w-full max-w-[280px] h-44 sm:h-48 md:w-56 md:h-56 rounded-2xl transition-all duration-300',
              'glass dark:glass-dark',
              'min-h-[44px]', // Minimum touch target size
              isActive && 'ring-2 ring-primary shadow-2xl'
            )}
            whileHover={!isActive ? { scale: 1.05, y: -5 } : {}}
            whileTap={{ scale: 0.97 }}
            style={{
              boxShadow: isActive
                ? `0 0 40px ${getModeColors(modeItem.id, isDark)}40`
                : undefined,
            }}
          >
            {/* Background glow */}
            <div
              className={cn(
                'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                'bg-gradient-to-br blur-xl -z-10'
              )}
              style={{
                background: `linear-gradient(135deg, ${getModeColors(
                  modeItem.id,
                  isDark
                )}40, transparent)`,
              }}
            />

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
              <Icon
                className={cn(
                  'w-16 h-16 md:w-20 md:h-20 transition-all duration-300',
                  isActive
                    ? 'text-primary scale-110'
                    : 'text-foreground/60 group-hover:text-foreground group-hover:scale-105'
                )}
              />

              <div className="text-center space-y-1">
                <h3
                  className={cn(
                    'text-xl md:text-2xl font-bold transition-colors duration-300',
                    isActive ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {modeItem.name}
                </h3>
                <p className="text-xs md:text-sm text-foreground/60">
                  {modeItem.description}
                </p>
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 rounded-2xl border-2 border-primary"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

