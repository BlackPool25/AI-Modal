'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, FileText, Users, Quote } from 'lucide-react'

interface Paper {
  id: string
  title: string
  authors: string
  journal: string
  year: string
  url: string
  abstract: string
  citations: string
  category: string
}

interface PaperCardProps {
  paper: Paper
  index: number
}

const categoryColors: Record<string, Record<string, string>> = {
  'Image Detection': { bg: '#38BDF8', light: '#38BDF820', border: '#38BDF840' },
  'Video Detection': { bg: '#F472B6', light: '#F472B620', border: '#F472B640' },
  'Text Detection': { bg: '#FB923C', light: '#FB923C20', border: '#FB923C40' },
  'Survey': { bg: '#A78BFA', light: '#A78BFA20', border: '#A78BFA40' },
  'Blockchain & Security': { bg: '#34D399', light: '#34D39920', border: '#34D39940' },
}

export function PaperCard({ paper, index }: PaperCardProps) {
  const colors = categoryColors[paper.category] || categoryColors['Survey']

  return (
    <motion.a
      href={paper.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ 
        y: -8,
        scale: 1.01,
        transition: { duration: 0.3 }
      }}
      className="block relative group"
    >
      <div className="relative h-full glass dark:glass-dark rounded-3xl p-6 md:p-8 border border-foreground/10 hover:border-primary/50 transition-all duration-500 overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${colors.light}, transparent 60%)`,
          }}
        />

        {/* Category and year */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <motion.div
            className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ 
              background: colors.light,
              border: `1px solid ${colors.border}`,
              color: colors.bg
            }}
            whileHover={{ scale: 1.05 }}
          >
            {paper.category}
          </motion.div>
          <span className="text-sm font-medium text-foreground/60">
            {paper.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-3 relative z-10 group-hover:text-primary transition-colors leading-tight">
          {paper.title}
        </h3>

        {/* Authors and Journal */}
        <div className="space-y-2 mb-4 relative z-10">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Users className="w-4 h-4" />
            <span className="font-medium">{paper.authors}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <FileText className="w-4 h-4" />
            <span className="italic">{paper.journal}</span>
          </div>
        </div>

        {/* Abstract */}
        <div className="relative z-10 mb-4">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 mt-1 flex-shrink-0 text-foreground/40" />
            <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
              {paper.abstract}
            </p>
          </div>
        </div>

        {/* Citations and Link */}
        <div className="flex items-center justify-between relative z-10 pt-4 border-t border-foreground/10">
          <div className="flex items-center gap-2">
            <div 
              className="px-3 py-1 rounded-lg text-xs font-bold"
              style={{ 
                background: colors.light,
                color: colors.bg
              }}
            >
              {paper.citations} citations
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <span>Read Paper</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{ background: colors.bg }}
        />
      </div>
    </motion.a>
  )
}


