'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function PageLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center origin-left overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            maxWidth: '100vw',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.3,
              delay: 0.1,
            }}
            className="text-center relative px-4"
          >
            {/* Logo Image - Place your logo.png in the public folder */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Fallback to text if no logo exists */}
              <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto">
                {/* Light mode logo */}
                <Image
                  src="/logo.png"
                  alt="DetectX Logo"
                  fill
                  className="object-contain drop-shadow-2xl dark:hidden"
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                  onError={(e) => {
                    // If logo doesn't exist, hide image and show text
                    e.currentTarget.style.display = 'none'
                    const fallback = document.getElementById('logo-fallback')
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                {/* Dark mode logo */}
                <Image
                  src="/logo-dark.png"
                  alt="DetectX Logo"
                  fill
                  className="object-contain drop-shadow-2xl hidden dark:block"
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                  onError={(e) => {
                    // If dark logo doesn't exist, use light logo
                    e.currentTarget.style.display = 'none'
                    const lightLogo = e.currentTarget.previousElementSibling as HTMLElement
                    if (lightLogo) lightLogo.classList.remove('dark:hidden')
                  }}
                />
              </div>
              
              {/* Text fallback if logo doesn't exist */}
              <div 
                id="logo-fallback" 
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter"
                style={{ display: 'none' }}
              >
                DetectX
              </div>
            </motion.div>
          </motion.div>

          {/* Wipe effect overlay */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute top-0 left-0 bottom-0 w-2/5 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
