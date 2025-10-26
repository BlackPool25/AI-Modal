'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Shield, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { fadeInUp, staggerContainer } from '@/lib/animationVariants'

const timeline = [
  { year: '2014', event: 'Generative Adversarial Networks (GANs) invented', description: 'Ian Goodfellow introduces GANs, laying foundation for AI-generated content' },
  { year: '2016', event: 'DeepMind\'s WaveNet creates realistic speech', description: 'First convincing AI-generated audio, marking the beginning of synthetic media' },
  { year: '2017', event: 'Face2Face real-time facial reenactment', description: 'Technology enables real-time face manipulation in video calls' },
  { year: '2018', event: 'First deepfake videos emerge publicly', description: 'Deepfake technology goes mainstream, raising concerns about misinformation' },
  { year: '2019', event: 'GPT-2 deemed "too dangerous to release"', description: 'OpenAI delays GPT-2 release due to fears of misuse in generating fake news' },
  { year: '2020', event: 'GPT-3 revolutionizes text generation', description: 'Large language models achieve near-human quality in text generation' },
  { year: '2021', event: 'DALL-E introduces text-to-image generation', description: 'AI can now create images from text descriptions with stunning accuracy' },
  { year: '2022', event: 'Stable Diffusion & Midjourney democratize AI art', description: 'AI image generation becomes accessible to everyone, sparking creative revolution' },
  { year: '2023', event: 'ChatGPT reaches 100M users in 2 months', description: 'Fastest-growing consumer application in history, AI goes mainstream' },
  { year: '2024', event: 'Sora & video generation becomes mainstream', description: 'AI-generated videos become indistinguishable from reality' },
  { year: '2025', event: 'AI detection becomes critical infrastructure', description: 'Detection tools become essential for maintaining digital trust and authenticity' },
]

const impacts = [
  {
    icon: AlertTriangle,
    title: 'Misinformation Crisis',
    description: 'AI-generated fake news spreads 6x faster than truth on social media',
    color: '#EF4444',
  },
  {
    icon: Shield,
    title: 'Identity Theft',
    description: 'Deepfake videos used in fraud schemes, costing millions annually',
    color: '#F97316',
  },
  {
    icon: Users,
    title: 'Trust Erosion',
    description: '73% of people can\'t distinguish AI-generated content from real',
    color: '#EC4899',
  },
  {
    icon: TrendingUp,
    title: 'Growing Threat',
    description: 'Synthetic media volume increasing by 900% year over year',
    color: '#8B5CF6',
  },
]

export default function AwarenessPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16">
      <div className="w-full space-y-20">
        {/* Hero */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-6 px-4"
        >
          <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            The Rise of{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Synthetic Media
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
            Understanding the impact of AI-generated content on society, truth, and trust
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-12 overflow-hidden"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-center mb-8 sm:mb-12 md:mb-16 px-4">
            Timeline: From Novelty to Crisis
          </motion.h2>
          
          <div className="relative py-8 sm:py-12 md:py-16">
            {/* Timeline line with gradient */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 md:w-2 bg-gradient-to-b from-primary via-accent to-primary opacity-20" />
            
            <div className="space-y-16 sm:space-y-24 md:space-y-32 lg:space-y-40">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ 
                    opacity: 0, 
                    x: index % 2 === 0 ? -50 : 50,
                    scale: 0.95
                  }}
                  whileInView={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  viewport={{ once: true, margin: '-50px', amount: 0.3 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    scale: {
                      duration: 0.6,
                      ease: 'easeOut'
                    }
                  }}
                  className={`relative flex items-start gap-3 sm:gap-4 md:gap-8 lg:gap-16 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Content side */}
                  <motion.div 
                    className={`flex-1 ${index % 2 === 0 ? 'text-right pr-2 sm:pr-4 md:pr-8 lg:pr-12' : 'text-left pl-2 sm:pl-4 md:pl-8 lg:pl-12'}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="glass dark:glass-dark rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-2xl transition-all duration-500 border border-primary/10">
                      <motion.div
                        initial={{ scale: 0.8, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: 'spring',
                          stiffness: 200,
                          damping: 15,
                          delay: 0.3
                        }}
                      >
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-primary mb-2 sm:mb-3 md:mb-6">
                          {item.year}
                        </h3>
                      </motion.div>
                      
                      <motion.h4 
                        className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4"
                        initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        {item.event}
                      </motion.h4>
                      
                      <motion.p 
                        className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 font-light leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  </motion.div>
                  
                  {/* Timeline dot */}
                  <motion.div 
                    className="relative flex-shrink-0 z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1
                    }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-primary ring-4 sm:ring-6 md:ring-8 lg:ring-10 ring-primary/20 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Empty side */}
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Impact Cards */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-6 sm:space-y-8"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-center px-4">
            Real-World Impact
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {impacts.map((impact, index) => {
              const Icon = impact.icon
              return (
                <motion.div key={impact.title} variants={fadeInUp} custom={index}>
                  <Card className="h-full glass dark:glass-dark border-foreground/10 hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                        style={{ background: `${impact.color}20` }}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: impact.color }} />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">{impact.title}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">{impact.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Why Detection Matters */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          className="glass dark:glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center space-y-4 sm:space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight px-2">Why Detection Matters</h2>
          <blockquote className="text-lg sm:text-xl md:text-2xl italic text-foreground/80 max-w-3xl mx-auto px-4">
            "Without the ability to distinguish real from synthetic, we lose our shared foundation of truth."
          </blockquote>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-4">
            AI detection technology is not just a tool—it's a necessity for preserving trust, 
            protecting identities, and maintaining the integrity of information in the digital age.
          </p>
        </motion.section>

      </div>
    </div>
  )
}

