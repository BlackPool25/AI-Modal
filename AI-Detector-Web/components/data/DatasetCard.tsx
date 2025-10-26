'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Download, Calendar, Database } from 'lucide-react'

interface Dataset {
  id: string
  title: string
  description: string
  url: string
  category: string
  size: string
  year: string
  downloads: string
}

interface DatasetCardProps {
  dataset: Dataset
  index: number
}

const categoryColors: Record<string, string> = {
  'Image': '#38BDF8',
  'Video': '#F472B6',
  'Text': '#FB923C',
}

export function DatasetCard({ dataset, index }: DatasetCardProps) {
  const color = categoryColors[dataset.category] || '#A78BFA'

  return (
    <motion.a
      href={dataset.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="block relative group"
    >
      <div className="relative h-full glass dark:glass-dark rounded-3xl p-6 md:p-8 border border-foreground/10 hover:border-primary/50 transition-all duration-500 overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Category badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 relative z-10"
          style={{ 
            background: `${color}20`,
            border: `1px solid ${color}40`
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Database className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-semibold" style={{ color }}>
            {dataset.category}
          </span>
        </motion.div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-3 relative z-10 group-hover:text-primary transition-colors">
          {dataset.title}
        </h3>

        {/* Description */}
        <p className="text-foreground/70 mb-6 leading-relaxed relative z-10">
          {dataset.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 mb-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Calendar className="w-4 h-4" />
            <span>{dataset.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Database className="w-4 h-4" />
            <span>{dataset.size}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <Download className="w-4 h-4" />
            <span>{dataset.downloads}</span>
          </div>
        </div>

        {/* Link indicator */}
        <div className="flex items-center gap-2 text-primary font-semibold relative z-10">
          <span>Access Dataset</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ExternalLink className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Decorative corner */}
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: color }}
        />
      </div>
    </motion.a>
  )
}


