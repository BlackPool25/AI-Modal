'use client'

import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type TransitionType = 'split' | 'wipe-left' | 'wipe-right' | 'slide-up' | 'fade'

interface ScrollSectionProps {
  children: React.ReactNode
  transitionType?: TransitionType
  className?: string
  backgroundColor?: string
}

export function ScrollSection({
  children,
  transitionType = 'fade',
  className = '',
  backgroundColor = 'transparent',
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const overlayLeftRef = useRef<HTMLDivElement>(null)
  const overlayRightRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const overlayLeft = overlayLeftRef.current
    const overlayRight = overlayRightRef.current
    const content = contentRef.current

    if (!section || !content) return

    const ctx = gsap.context(() => {
      // Set initial states based on transition type
      switch (transitionType) {
        case 'split':
          if (overlayLeft && overlayRight) {
            gsap.set(overlayLeft, { scaleX: 1, transformOrigin: 'left' })
            gsap.set(overlayRight, { scaleX: 1, transformOrigin: 'right' })
            gsap.set(content, { opacity: 0, scale: 0.9 })

            ScrollTrigger.create({
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
              onUpdate: (self) => {
                const progress = self.progress
                gsap.to(overlayLeft, { scaleX: 1 - progress, duration: 0.1 })
                gsap.to(overlayRight, { scaleX: 1 - progress, duration: 0.1 })
                gsap.to(content, { 
                  opacity: progress, 
                  scale: 0.9 + (progress * 0.1),
                  duration: 0.1 
                })
              },
            })
          }
          break

        case 'wipe-left':
          gsap.set(content, { x: '100%', opacity: 0 })
          ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.to(content, {
                x: `${100 - progress * 100}%`,
                opacity: progress,
                duration: 0.1,
              })
            },
          })
          break

        case 'wipe-right':
          gsap.set(content, { x: '-100%', opacity: 0 })
          ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.to(content, {
                x: `${-100 + progress * 100}%`,
                opacity: progress,
                duration: 0.1,
              })
            },
          })
          break

        case 'slide-up':
          gsap.set(content, { y: 100, opacity: 0 })
          ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.to(content, {
                y: 100 - progress * 100,
                opacity: progress,
                duration: 0.1,
              })
            },
          })
          break

        case 'fade':
          gsap.set(content, { opacity: 0, y: 50 })
          ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
            onUpdate: (self) => {
              const progress = self.progress
              gsap.to(content, {
                opacity: progress,
                y: 50 - progress * 50,
                duration: 0.1,
              })
            },
          })
          break
      }
    }, section)

    return () => ctx.revert()
  }, [transitionType])

  return (
    <div
      ref={sectionRef}
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {/* Split transition overlays */}
      {transitionType === 'split' && (
        <>
          <div
            ref={overlayLeftRef}
            className="absolute inset-0 bg-background z-20 origin-left"
            style={{ width: '50%' }}
          />
          <div
            ref={overlayRightRef}
            className="absolute inset-0 bg-background z-20 origin-right"
            style={{ width: '50%', left: '50%' }}
          />
        </>
      )}

      {/* Content */}
      <div ref={contentRef} className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}


