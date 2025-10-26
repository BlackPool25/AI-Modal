'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Scan, Brain, CheckCircle, FileText, Image, Video } from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'

const pipeline = [
  {
    step: 1,
    icon: Upload,
    title: 'Upload Content',
    description: 'User uploads text, image, or video for analysis',
  },
  {
    step: 2,
    icon: Scan,
    title: 'Feature Extraction',
    description: 'Extract relevant features and patterns from the content',
  },
  {
    step: 3,
    icon: Brain,
    title: 'Model Inference',
    description: 'Deep learning models analyze extracted features',
  },
  {
    step: 4,
    icon: CheckCircle,
    title: 'Classification',
    description: 'Generate confidence score and authenticity verdict',
  },
]

const methods = [
  {
    type: 'Text Detection',
    icon: FileText,
    color: '#38BDF8',
    features: [
      {
        title: 'Linguistic Patterns',
        description: 'Analyze word choice, sentence structure, and writing style',
      },
      {
        title: 'Token Distribution',
        description: 'Statistical analysis of token probabilities',
      },
      {
        title: 'Perplexity Analysis',
        description: 'Measure how "surprised" a model is by the text',
      },
    ],
  },
  {
    type: 'Image Detection',
    icon: Image,
    color: '#F472B6',
    features: [
      {
        title: 'Pixel Artifacts',
        description: 'Detect synthetic patterns and inconsistencies',
      },
      {
        title: 'Frequency Analysis',
        description: 'Analyze frequency domain signatures',
      },
      {
        title: 'GAN Fingerprints',
        description: 'Identify unique patterns from generative models',
      },
    ],
  },
  {
    type: 'Video Detection',
    icon: Video,
    color: '#FB923C',
    features: [
      {
        title: 'Temporal Consistency',
        description: 'Check frame-to-frame coherence',
      },
      {
        title: 'Facial Analysis',
        description: 'Detect unnatural facial movements',
      },
      {
        title: 'Audio-Visual Sync',
        description: 'Verify lip-sync and audio alignment',
      },
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Hero */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-6"
        >
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold">
            How It{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Works
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Understanding the technology behind AI content detection
          </motion.p>
        </motion.div>

        {/* Vertical Pipeline */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center">
            Detection Pipeline
          </motion.h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Vertical connecting line aligned with step badges */}
            <motion.div
              className="absolute left-[30px] md:left-[46px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-20"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ transformOrigin: 'top' }}
            />

            <div className="space-y-16">
              {pipeline.map((item, index) => {
                const Icon = item.icon
                const colors = [
                  '#38BDF8', // Blue
                  '#F472B6', // Pink
                  '#FB923C', // Orange
                  '#34D399', // Green
                ]
                const color = colors[index] || '#A78BFA'

                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="relative flex items-start gap-8 md:gap-16"
                  >
                    {/* Icon and Step Number */}
                    <div className="relative flex-shrink-0">
                      {/* Main Icon Circle */}
                      <motion.div
                        className="relative w-16 h-16 md:w-28 md:h-28 rounded-full flex items-center justify-center z-10 overflow-hidden"
                        style={{ background: `${color}20` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Rotating gradient border effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, ${color}, transparent, ${color})`,
                            opacity: 0.6,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />

                        {/* Subtle bounce animation */}
                        <motion.div
                          animate={{ 
                            y: [-2, 2, -2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.3,
                          }}
                        >
                          <Icon 
                            className="w-8 h-8 md:w-14 md:h-14 relative z-10" 
                            style={{ color }} 
                          />
                        </motion.div>
                      </motion.div>

                      {/* Step number badge */}
                      <motion.div
                        className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base z-20"
                        style={{ 
                          background: color,
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          delay: index * 0.2 + 0.3,
                        }}
                      >
                        {item.step}
                      </motion.div>
                    </div>

                    {/* Content Card */}
                    <motion.div
                      className="flex-1 pb-8"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    >
                      <div 
                        className="glass dark:glass-dark rounded-3xl p-6 md:p-10 border-l-4 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                        style={{ borderLeftColor: color }}
                      >
                        {/* Animated background gradient */}
                        <motion.div
                          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at top right, ${color}10, transparent 70%)`,
                          }}
                        />

                        <div className="relative z-10">
                          <h3 className="text-2xl md:text-4xl font-bold mb-4" style={{ color }}>
                            {item.title}
                          </h3>
                          <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Decorative corner element */}
                        <div
                          className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-10"
                          style={{ background: color }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Detection Methods */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center">
            Detection Methods
          </motion.h2>

          <div className="space-y-12 max-w-6xl mx-auto">
            {methods.map((method, index) => {
              const Icon = method.icon

              return (
                <motion.div 
                  key={method.type}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className="glass dark:glass-dark rounded-3xl p-8 md:p-12 border-l-4 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
                    style={{ borderLeftColor: method.color }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${method.color}08, transparent 60%)`,
                      }}
                    />

                    {/* Header */}
                    <div className="flex items-center gap-6 mb-8 relative z-10">
                      <motion.div
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ background: `${method.color}20` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {/* Rotating gradient border effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, ${method.color}, transparent, ${method.color})`,
                            opacity: 0.6,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        
                        {/* Subtle bounce animation */}
                        <motion.div
                          animate={{ 
                            y: [-2, 2, -2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.3,
                          }}
                        >
                          <Icon className="w-10 h-10 md:w-12 md:h-12 relative z-10" style={{ color: method.color }} />
                        </motion.div>
                      </motion.div>
                      
                      <h3 className="text-3xl md:text-4xl font-bold" style={{ color: method.color }}>
                        {method.type}
                      </h3>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                      {method.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={feature.title}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.2 + featureIndex * 0.1,
                          }}
                          className="space-y-3 group/feature"
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                              style={{ background: method.color }}
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-2 group-hover/feature:text-primary transition-colors">
                                {feature.title}
                              </h4>
                              <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Decorative corner blob */}
                    <div
                      className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                      style={{ background: method.color }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Model Architecture */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="glass dark:glass-dark rounded-3xl p-12 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">Model Architecture</h2>
          <p className="text-lg text-foreground/70 text-center max-w-3xl mx-auto">
            Our detection models are built on state-of-the-art deep learning architectures, 
            trained on millions of authentic and synthetic samples across multiple domains.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">99.2%</div>
              <div className="text-sm text-foreground/70">Accuracy</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">10M+</div>
              <div className="text-sm text-foreground/70">Training Samples</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">&lt;2s</div>
              <div className="text-sm text-foreground/70">Analysis Time</div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

