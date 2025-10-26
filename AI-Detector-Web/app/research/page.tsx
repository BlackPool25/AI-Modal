'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Video, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PaperCard } from '@/components/data/PaperCard'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'

type PaperType = 'all' | 'Image Detection' | 'Video Detection' | 'Text Detection' | 'Survey' | 'Blockchain & Security'

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

export default function ResearchPage() {
  const [filter, setFilter] = useState<PaperType>('all')
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/papers/papers.json')
      .then(res => res.json())
      .then(data => {
        setPapers(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading papers:', error)
        setLoading(false)
      })
  }, [])

  const filteredPapers = filter === 'all'
    ? papers
    : papers.filter(p => p.category === filter)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-6"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            Research &{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Papers
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Academic research and methodology behind our detection technology
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3"
        >
          {(['all', 'Image Detection', 'Video Detection', 'Text Detection', 'Survey'] as PaperType[]).map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'default' : 'ghost'}
              onClick={() => setFilter(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <BookOpen className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="mt-4 text-foreground/60">Loading research papers...</p>
          </div>
        )}

        {/* Papers Grid with Tiling Animation */}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPapers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPapers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No papers found for this category.</p>
          </motion.div>
        )}

        {/* Our Contributions */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="glass dark:glass-dark rounded-3xl p-12 text-center space-y-6"
        >
          <h2 className="text-3xl font-bold">Our Contributions</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our research team has published extensively on AI detection methods, 
            contributing to the advancement of digital authenticity verification.
          </p>
          <Button variant="default" size="lg">
            View All Publications →
          </Button>
        </motion.section>
      </div>
    </div>
  )
}

