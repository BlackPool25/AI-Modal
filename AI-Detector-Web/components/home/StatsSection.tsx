'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Zap, Shield } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '99.8%',
    label: 'Accuracy Rate',
    color: '#38BDF8',
  },
  {
    icon: Users,
    value: '500K+',
    label: 'Active Users',
    color: '#F472B6',
  },
  {
    icon: Zap,
    value: '<1s',
    label: 'Detection Speed',
    color: '#FB923C',
  },
  {
    icon: Shield,
    value: '24/7',
    label: 'Protection',
    color: '#34D399',
  },
]

export function StatsSection() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Trusted Worldwide
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Industry-leading accuracy and performance for detecting AI-generated content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                className="relative group"
              >
                <div className="glass dark:glass-dark rounded-3xl p-8 text-center relative overflow-hidden border border-foreground/10 hover:shadow-2xl transition-all duration-500">
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${stat.color}15, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center overflow-hidden"
                    style={{ background: `${stat.color}20` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Rotating gradient border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `conic-gradient(from 0deg, ${stat.color}, transparent, ${stat.color})`,
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
                      <Icon className="w-10 h-10 relative z-10" style={{ color: stat.color }} />
                    </motion.div>
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className="text-5xl md:text-6xl font-black mb-3"
                    style={{ color: stat.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.4 + index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    {stat.value}
                  </motion.div>

                  {/* Label */}
                  <div className="text-lg font-medium text-foreground/70">
                    {stat.label}
                  </div>

                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top right, ${stat.color}, transparent)`,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


