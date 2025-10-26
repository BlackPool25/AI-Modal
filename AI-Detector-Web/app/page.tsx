'use client'

import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { StatsSection } from '@/components/home/StatsSection'
import { ScrollSection } from '@/components/scroll/ScrollSection'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section - Split Transition */}
      <ScrollSection transitionType="split">
        <Hero />
      </ScrollSection>

      {/* How It Works - Stretch Animation */}
      <HowItWorks />
      
      {/* Quote Section - Wipe from Left to Right */}
      <ScrollSection transitionType="wipe-right">
        <div className="flex items-center justify-center min-h-screen w-full px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-6xl mx-auto text-center space-y-8"
          >
            <motion.blockquote
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent px-4"
            >
              "In an age of AI, truth has pixels."
            </motion.blockquote>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-3xl mx-auto font-light px-6"
            >
              Digital authenticity is the foundation of trust. Our detectors help preserve truth in an increasingly synthetic world.
            </motion.p>
          </motion.div>
        </div>
      </ScrollSection>

      {/* Stats Section - Split Transition */}
      <ScrollSection transitionType="split">
        <StatsSection />
      </ScrollSection>

      {/* CTA Section - Slide Up */}
      <ScrollSection transitionType="slide-up">
        <div className="flex items-center justify-center min-h-screen w-full px-4 md:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-6xl mx-auto text-center space-y-8 glass dark:glass-dark rounded-3xl p-12 md:p-16 border border-primary/20"
          >
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent px-4"
            >
              Ready to Start Detecting?
            </motion.h2>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto px-6"
            >
              Join thousands of users who trust our AI detection technology to verify content authenticity.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex justify-center px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(var(--primary-rgb), 0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto min-h-[48px] px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all"
              >
                Start Detecting →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </ScrollSection>
    </div>
  )
}

