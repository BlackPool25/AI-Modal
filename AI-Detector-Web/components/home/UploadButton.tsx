'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import { useMode } from '@/components/providers/ThemeProvider'
import { getModeColors } from '@/lib/utils'

interface UploadButtonProps {
  onClick: () => void
}

export function UploadButton({ onClick }: UploadButtonProps) {
  const { mode, isDark } = useMode()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
      className="flex justify-center mt-8"
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="glass-modal dark:glass-modal-dark rounded-[20px] px-8 py-4 shadow-xl transition-all duration-300 group relative overflow-hidden"
        style={{
          boxShadow: `0 0 30px ${getModeColors(mode, isDark)}30`,
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${getModeColors(
              mode,
              isDark
            )}20, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative flex items-center space-x-3">
          <Upload className="w-5 h-5" />
          <span className="text-lg font-semibold">Upload to Detect</span>
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-[20px]"
          style={{
            border: `2px solid ${getModeColors(mode, isDark)}`,
            opacity: 0,
          }}
          whileHover={{
            opacity: 1,
            transition: { duration: 0.3 },
          }}
        />
      </motion.button>
    </motion.div>
  )
}

