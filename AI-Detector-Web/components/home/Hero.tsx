'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ModeTiles } from './ModeTiles'
import { UploadButton } from './UploadButton'
import { UploadModal } from './UploadModal'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [titleTilt, setTitleTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 20
    const y = (e.clientY - rect.top - rect.height / 2) / 20
    setTitleTilt({ x: -y, y: x })
  }

  const handleMouseLeave = () => {
    setTitleTilt({ x: 0, y: 0 })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 pt-32 sm:pt-28 md:pt-24 lg:pt-20 overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full text-center space-y-8 sm:space-y-10 md:space-y-12"
      >
        {/* Headline */}
        <motion.div 
          variants={fadeInUp} 
          className="space-y-4"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight px-2"
            style={{
              transformStyle: 'preserve-3d',
              rotateX: titleTilt.x,
              rotateY: titleTilt.y,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient inline-block">
              Reality or Illusion?
            </span>
          </motion.h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/70 max-w-4xl mx-auto font-light px-4">
            Detect AI-generated images, videos, and text — instantly.
          </p>
        </motion.div>

        {/* Mode Tiles */}
        <motion.div variants={fadeInUp}>
          <ModeTiles />
        </motion.div>

        {/* Upload Button */}
        <UploadButton onClick={() => setIsModalOpen(true)} />
      </motion.div>

      {/* Upload Modal */}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

