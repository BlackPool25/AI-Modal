'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, FileText, Image, Video, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DatasetCard } from '@/components/data/DatasetCard'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'

type DatasetType = 'all' | 'Text' | 'Image' | 'Video'

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

const typeIcons = {
  Text: FileText,
  Image: Image,
  Video: Video,
}

export default function DatasetsPage() {
  const [filter, setFilter] = useState<DatasetType>('all')
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/datasets/datasets.json')
      .then(res => res.json())
      .then(data => {
        setDatasets(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading datasets:', error)
        setLoading(false)
      })
  }, [])

  const filteredDatasets = filter === 'all' 
    ? datasets 
    : datasets.filter(d => d.category === filter)

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
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Datasets
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Comprehensive training and testing datasets for AI content detection
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="flex flex-wrap justify-center gap-3"
        >
          {(['all', 'Text', 'Image', 'Video'] as DatasetType[]).map((type) => {
            const Icon = type === 'all' ? Filter : typeIcons[type as keyof typeof typeIcons]
            return (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'ghost'}
                onClick={() => setFilter(type)}
                className="capitalize"
              >
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {type}
              </Button>
            )
          })}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Database className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="mt-4 text-foreground/60">Loading datasets...</p>
          </div>
        )}

        {/* Dataset Grid with Tiling Animation */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset, index) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDatasets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Database className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No datasets found for this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

