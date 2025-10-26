'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Video, Activity, Brain, CheckCircle, Zap, Shield, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { TiltText } from '@/components/animations/TiltText'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const detectors = [
  {
    icon: FileText,
    title: 'Text Detection',
    description: 'Linguistic patterns and statistical fingerprints',
    features: [
      'Perplexity analysis',
      'Token distribution',
      'Syntax anomalies',
      'Model signatures',
    ],
    color: '#38BDF8',
  },
  {
    icon: Image,
    title: 'Image Detection',
    description: 'Computer vision and forensic analysis',
    features: [
      'GAN artifacts',
      'Pixel inconsistencies',
      'Frequency analysis',
      'Metadata inspection',
    ],
    color: '#F472B6',
  },
  {
    icon: Video,
    title: 'Video Detection',
    description: 'Temporal analysis and frame inspection',
    features: [
      'Temporal consistency',
      'Motion artifacts',
      'Frame interpolation',
      'Audio-visual sync',
    ],
    color: '#FB923C',
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subheadingRef = useRef<HTMLParagraphElement>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  // GSAP Dynamic Text Reveal Animation
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !subheadingRef.current) return

    const section = sectionRef.current
    const heading = headingRef.current
    const subheading = subheadingRef.current

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Check if mobile device for performance optimization
    const isMobile = window.innerWidth < 768

    // Split heading into individual characters/words for animation (skip on mobile for performance)
    const headingText = heading.textContent || ''
    if (!isMobile && !prefersReducedMotion) {
      heading.innerHTML = headingText
        .split('')
        .map((char) => `<span class="char" style="display: inline-block; opacity: 0; transform: scaleY(0) translateY(-50px); will-change: transform, opacity;">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('')
    }

    const chars = heading.querySelectorAll('.char')

    // Animate section stretching down (simplified on mobile)
    gsap.fromTo(
      section,
      {
        scaleY: isMobile ? 1 : 0,
        transformOrigin: 'top center',
        opacity: 0,
      },
      {
        scaleY: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 90%',
          end: 'top 60%',
          scrub: isMobile ? 0.5 : 1, // Faster on mobile
        },
      }
    )

    // Animate characters falling into place (only on desktop)
    if (chars.length > 0 && !isMobile && !prefersReducedMotion) {
      gsap.to(chars, {
        opacity: 1,
        scaleY: 1,
        translateY: 0,
        stagger: {
          amount: 0.8,
          from: 'center',
        },
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1,
        },
      })
    } else {
      // Simple fade-in for mobile
      gsap.fromTo(
        heading,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            end: 'top 60%',
            scrub: 0.5,
          },
        }
      )
    }

    // Animate subheading
    gsap.fromTo(
      subheading,
      {
        opacity: 0,
        y: isMobile ? 20 : 30,
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: subheading,
          start: 'top 85%',
          end: 'top 60%',
          scrub: isMobile ? 0.5 : 1,
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section || trigger.vars.trigger === heading || trigger.vars.trigger === subheading) {
          trigger.kill()
        }
      })
    }
  }, [])

  // Card expand/collapse handlers
  const handleCardInteraction = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <section ref={sectionRef} className="relative py-20 px-4 md:px-8 lg:px-16">
      <div className="w-full">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-12"
        >
          {/* Section header */}
          <div className="text-center space-y-4 px-4">
            <h2 
              ref={headingRef}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight"
            >
              How Our Detectors Work
            </h2>
            <p 
              ref={subheadingRef}
              className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
            >
              Advanced AI models trained on millions of samples to identify synthetic content
            </p>
          </div>

          {/* Detection cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {detectors.map((detector, index) => {
              const Icon = detector.icon
              const isExpanded = expandedCard === detector.title

              return (
                <motion.div
                  key={detector.title}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  onHoverStart={() => handleCardInteraction(detector.title)}
                  onHoverEnd={() => setExpandedCard(null)}
                  onClick={() => handleCardInteraction(detector.title)}
                  className="cursor-pointer"
                >
                  <Card className="h-full glass dark:glass-dark border-foreground/10 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    {/* Gradient shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${detector.color}20, transparent 50%, ${detector.color}20)`,
                        backgroundSize: '200% 200%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    
                    <CardHeader className="relative z-10">
                      <motion.div
                        className="relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                        style={{
                          background: `${detector.color}20`,
                        }}
                        animate={isExpanded ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {/* Rotating gradient border */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: `conic-gradient(from 0deg, ${detector.color}, transparent, ${detector.color})`,
                            opacity: 0.5,
                          }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        
                        <Icon
                          className="w-10 h-10 relative z-10 transition-all duration-300"
                          style={{ color: detector.color }}
                        />
                      </motion.div>
                      
                      <CardTitle className="text-2xl mb-3">{detector.title}</CardTitle>
                      <CardDescription className="text-base">{detector.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={isExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <ul className="space-y-3 pt-2">
                          {detector.features.map((feature, featureIndex) => (
                            <motion.li
                              key={feature}
                              initial={{ opacity: 0, x: -20 }}
                              animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{
                                duration: 0.3,
                                delay: featureIndex * 0.05,
                              }}
                              className="flex items-start space-x-3 text-sm"
                            >
                              <CheckCircle
                                className="w-5 h-5 mt-0.5 flex-shrink-0"
                                style={{ color: detector.color }}
                              />
                              <span className="text-foreground/70">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </CardContent>
                    
                    {/* Corner accent with magnetic effect */}
                    <motion.div 
                      className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top right, ${detector.color}, transparent)`,
                      }}
                      animate={isExpanded ? { scale: 1.2 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Vertical Detection Pipeline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto px-4"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16"
            >
              Detection Pipeline
            </motion.h3>

            <div className="relative">
              {/* Vertical connecting line - aligned with step number badges */}
              <motion.div
                className="absolute left-[30px] md:left-[46px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-20"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
              />

              <div className="space-y-8 sm:space-y-10 md:space-y-12">
                {[
                  { 
                    icon: Zap, 
                    step: 1, 
                    title: 'Upload Content', 
                    description: 'Select your text, image, or video file. Our system accepts multiple formats and processes them securely.',
                    color: '#38BDF8',
                    details: ['Drag & drop support', 'Multiple file formats', 'Encrypted upload']
                  },
                  { 
                    icon: Brain, 
                    step: 2, 
                    title: 'AI Analysis', 
                    description: 'Advanced neural networks analyze patterns, artifacts, and statistical signatures unique to AI-generated content.',
                    color: '#F472B6',
                    details: ['Deep learning models', 'Pattern recognition', 'Real-time processing']
                  },
                  { 
                    icon: Activity,
                    step: 3,
                    title: 'Feature Extraction',
                    description: 'Extract key features and fingerprints that distinguish AI-generated content from human-created content.',
                    color: '#FB923C',
                    details: ['Frequency analysis', 'Metadata inspection', 'Statistical testing']
                  },
                  { 
                    icon: Shield, 
                    step: 4, 
                    title: 'Get Results', 
                    description: 'Receive a detailed confidence score with explanations, heatmaps, and supporting evidence for the detection.',
                    color: '#34D399',
                    details: ['Confidence score', 'Visual heatmaps', 'Detailed report']
                  },
                ].map((item, index) => {
                  const StepIcon = item.icon
                  const isEven = index % 2 === 0
                  
                  return (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                        className="relative flex items-start gap-4 sm:gap-6 md:gap-12"
                    >
                      {/* Step indicator */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          className="relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center overflow-hidden"
                          style={{ background: `${item.color}20` }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Rotating gradient border effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `conic-gradient(from 0deg, ${item.color}, transparent, ${item.color})`,
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
                            <StepIcon 
                              className="w-8 h-8 md:w-12 md:h-12 relative z-10" 
                              style={{ color: item.color }} 
                            />
                          </motion.div>
                        </motion.div>

                        {/* Step number badge */}
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ 
                            background: item.color,
                            color: 'white'
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

                      {/* Content */}
                      <motion.div
                        className="flex-1 pb-4 sm:pb-6 md:pb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                      >
                        <div className="glass dark:glass-dark rounded-2xl p-4 sm:p-6 md:p-8 border-l-4 hover:shadow-xl transition-all duration-500" style={{ borderLeftColor: item.color }}>
                          <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3" style={{ color: item.color }}>
                            {item.title}
                          </h4>
                          <p className="text-sm sm:text-base text-foreground/70 mb-3 sm:mb-4 leading-relaxed">
                            {item.description}
                          </p>
                          
                          {/* Detail pills */}
                          <div className="flex flex-wrap gap-2">
                            {item.details.map((detail, detailIndex) => (
                              <motion.span
                                key={detail}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.2 + detailIndex * 0.1 + 0.4,
                                }}
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  background: `${item.color}15`,
                                  color: item.color,
                                }}
                              >
                                {detail}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

