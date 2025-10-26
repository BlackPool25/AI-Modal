'use client'

import React, { useEffect, useRef } from 'react'
import { useMode } from '@/components/providers/ThemeProvider'
import { DetectionMode } from '@/lib/utils'
import { FEATURE_FLAGS } from '@/lib/themeConfig'

export function BackgroundAnimation() {
  const { mode, isDark } = useMode()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const ripplesRef = useRef<Array<{ x: number; y: number; radius: number; maxRadius: number; opacity: number }>>([])
  const lastRippleTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Improves performance on some devices
    })
    if (!ctx) return

    // Optimize canvas rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'low' // Faster rendering on low-end devices

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Calculate ripple size based on screen size
    const getMaxRippleRadius = () => {
      const screenSize = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
      return Math.min(screenSize * 0.4, 500) // Much larger ripples for depth
    }

    // Mouse movement tracking with moderate delay for tasteful, non-distracting effect
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, isMoving: true }
      
      // Only create ripples if feature is enabled
      if (!FEATURE_FLAGS.enableRippleEffect) return
      
      const now = Date.now()
      const timeSinceLastRipple = now - lastRippleTimeRef.current
      
      // Create ripple every 400ms (reduced from 800ms)
      if (timeSinceLastRipple > 400) {
        lastRippleTimeRef.current = now
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: getMaxRippleRadius(),
          opacity: isDark ? 0.6 : 0.7, // Slightly higher for better visibility
        })
        
        // Limit total ripples to 5
        if (ripplesRef.current.length > 5) {
          ripplesRef.current.shift()
        }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isMoving = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        mouseRef.current = { x: touch.clientX, y: touch.clientY, isMoving: true }
        
        // Only create ripples if feature is enabled
        if (!FEATURE_FLAGS.enableRippleEffect) return
        
        const now = Date.now()
        const timeSinceLastRipple = now - lastRippleTimeRef.current
        
        // Create ripple every 600ms on mobile
        if (timeSinceLastRipple > 600) {
          lastRippleTimeRef.current = now
          ripplesRef.current.push({
            x: touch.clientX,
            y: touch.clientY,
            radius: 0,
            maxRadius: getMaxRippleRadius() * 0.8,
            opacity: 0.6,
          })
          
          // Limit to 4 ripples on mobile
          if (ripplesRef.current.length > 4) {
            ripplesRef.current.shift()
          }
        }
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleMouseLeave)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      canvasWidth: number
      canvasHeight: number

      constructor(mode: DetectionMode, isDark: boolean, width: number, height: number) {
        this.canvasWidth = width
        this.canvasHeight = height
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        // Increased opacity for better visibility in light mode
        this.opacity = isDark ? Math.random() * 0.5 + 0.2 : Math.random() * 0.6 + 0.3
        this.color = this.getColorForMode(mode, isDark)
      }

      getColorForMode(mode: DetectionMode, isDark: boolean): string {
        if (isDark) {
          // Dark mode colors
          const colors = {
            text: '#38bdf8',      // Optimized cyan
            image: '#d946ef',     // Optimized magenta (less saturated)
            video: '#fb923c',     // Optimized coral
          }
          return colors[mode]
        } else {
          // Light mode colors - more visible
          const colors = {
            text: '#0ea5e9',      // Brighter blue for light mode
            image: '#d946ef',     // Brighter purple for light mode
            video: '#f97316',     // Brighter orange for light mode
          }
          return colors[mode]
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvasWidth) this.speedX *= -1
        if (this.y < 0 || this.y > this.canvasHeight) this.speedY *= -1
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Create particles based on mode - optimized for mobile
    let particles: Particle[] = []
    const isMobile = window.innerWidth < 768
    const createParticles = (mode: DetectionMode, isDark: boolean) => {
      // Reduce particle count on mobile, especially for image mode (blur is expensive)
      let count: number
      if (isMobile) {
        count = mode === 'text' ? 50 : mode === 'image' ? 35 : 40
      } else {
        count = mode === 'text' ? 100 : mode === 'image' ? 60 : 60
      }
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(mode, isDark, canvas.width, canvas.height))
      }
    }

    createParticles(mode, isDark)

    // Animation loop with FPS throttling for mobile
    let animationFrameId: number
    let lastFrameTime = 0
    const targetFPS = isMobile ? 30 : 60 // Lower FPS on mobile for better performance
    const frameInterval = 1000 / targetFPS
    
    const animate = (currentTime: number = 0) => {
      if (!ctx || !canvas) return
      
      // Throttle frame rate on mobile
      const elapsed = currentTime - lastFrameTime
      if (elapsed < frameInterval) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = currentTime - (elapsed % frameInterval)
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw cursor ripples first (background layer) - GLASSY DEPTH water ripple effect
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 1.8 // Moderate speed for smooth glassy movement
        ripple.opacity -= 0.005 // Slow fade for longer visibility
        
        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          return false
        }
        
        const color = particles[0]?.color || (isDark ? '#38bdf8' : '#0ea5e9')
        const progress = ripple.radius / ripple.maxRadius
        
        // LAYER 1: Outer atmosphere - furthest depth (largest scale)
        ctx.save()
        ctx.globalAlpha = ripple.opacity * 0.12
        const atmosphere = ctx.createRadialGradient(
          ripple.x, ripple.y, ripple.radius * 0.98,
          ripple.x, ripple.y, ripple.radius * 1.05
        )
        atmosphere.addColorStop(0, 'transparent')
        atmosphere.addColorStop(0.5, color + '30')
        atmosphere.addColorStop(1, 'transparent')
        ctx.strokeStyle = atmosphere
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
        
        // LAYER 2: Far glass ring - depth at 85% scale
        if (ripple.radius > 20) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * 0.2
          ctx.strokeStyle = color + '50'
          ctx.lineWidth = 4
          ctx.shadowColor = color
          ctx.shadowBlur = 15
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.85, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        
        // LAYER 3: Mid-far glass ring - depth at 70% scale  
        if (ripple.radius > 15) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * 0.35
          const midFar = ctx.createRadialGradient(
            ripple.x, ripple.y, ripple.radius * 0.68,
            ripple.x, ripple.y, ripple.radius * 0.72
          )
          midFar.addColorStop(0, color + '80')
          midFar.addColorStop(1, color + '50')
          ctx.strokeStyle = midFar
          ctx.lineWidth = 4.5
          ctx.shadowColor = color
          ctx.shadowBlur = 18
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        
        // LAYER 4: Middle glass ring - depth at 55% scale (main visible layer)
        if (ripple.radius > 10) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * 0.5
          const midGradient = ctx.createRadialGradient(
            ripple.x, ripple.y, ripple.radius * 0.53,
            ripple.x, ripple.y, ripple.radius * 0.57
          )
          midGradient.addColorStop(0, color + 'BB')
          midGradient.addColorStop(1, color + '77')
          ctx.strokeStyle = midGradient
          ctx.lineWidth = isDark ? 5 : 6
          ctx.shadowColor = color
          ctx.shadowBlur = 22
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.55, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        
        // LAYER 5: Near glass ring - depth at 40% scale
        if (ripple.radius > 8) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * 0.65
          ctx.strokeStyle = color + 'CC'
          ctx.lineWidth = 4
          ctx.shadowColor = color
          ctx.shadowBlur = 25
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.4, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        
        // LAYER 6: Inner shimmer ring - depth at 25% scale (brightest)
        if (ripple.radius > 5) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * 0.8
          ctx.strokeStyle = color + 'EE'
          ctx.lineWidth = 3
          ctx.shadowColor = color
          ctx.shadowBlur = 28
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.25, 0, Math.PI * 2)
          ctx.stroke()
          ctx.restore()
        }
        
        // LAYER 7: Center epicenter - glassy core with radial fill
        if (ripple.radius < ripple.maxRadius * 0.5) {
          ctx.save()
          ctx.globalAlpha = ripple.opacity * (1 - progress) * 0.7
          const centerGradient = ctx.createRadialGradient(
            ripple.x, ripple.y, 0,
            ripple.x, ripple.y, ripple.radius * 0.2
          )
          centerGradient.addColorStop(0, color + 'DD')
          centerGradient.addColorStop(0.4, color + '88')
          centerGradient.addColorStop(1, 'transparent')
          ctx.fillStyle = centerGradient
          ctx.shadowColor = color
          ctx.shadowBlur = 30
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
        
        return true
      })

      // Mouse interaction - SUBTLE attract particles (reduced for less distraction)
      if (mouseRef.current.isMoving) {
        particles.forEach((particle) => {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          // Reduced range and force for subtle, non-distracting interaction
          if (distance < 120) {
            const force = (120 - distance) / 120
            particle.x += (dx / distance) * force * 0.3 // Reduced from 0.5
            particle.y += (dy / distance) * force * 0.3
          }
        })
      }

      // Mode-specific effects
      if (mode === 'text') {
        // Flowing lines for text mode
        particles.forEach((particle) => {
          particle.update()
          particle.draw(ctx)
        })

        // Draw connections
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.save()
              // Light mode: more visible connections
              const connectionOpacity = isDark ? 0.2 : 0.25
              ctx.globalAlpha = (1 - distance / 100) * connectionOpacity
              ctx.strokeStyle = p1.color
              ctx.lineWidth = isDark ? 0.5 : 1
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
              ctx.restore()
            }
          })
        })
        
        // Light mode only: Add gentle floating orbs (more visible)
        if (!isDark) {
          const time = currentTime * 0.0005
          particles.slice(0, 15).forEach((particle, i) => {
            ctx.save()
            const wave = Math.sin(time + i * 0.5) * 0.3 + 0.7
            ctx.globalAlpha = 0.08 * wave // Increased from 0.03
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size * 15
            )
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.size * 15, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          })
        }
      } else if (mode === 'image') {
        // Bokeh particles for image mode - optimized for performance
        particles.forEach((particle) => {
          particle.update()
          
          // Simulate blur with layered circles (much faster than CSS blur filter)
          ctx.save()
          
          // Light mode: more visible bokeh effect
          const opacityMultiplier = isDark ? 1 : 0.9
          
          // Outer glow layer (largest, most transparent)
          ctx.globalAlpha = particle.opacity * 0.08 * opacityMultiplier
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2)
          ctx.fill()
          
          // Middle layer
          ctx.globalAlpha = particle.opacity * 0.15 * opacityMultiplier
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2)
          ctx.fill()
          
          // Core layer (smallest, most opaque)
          ctx.globalAlpha = particle.opacity * 0.25 * opacityMultiplier
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.restore()
        })
        
        // Light mode only: Add paper texture effect (more visible)
        if (!isDark) {
          ctx.save()
          ctx.globalAlpha = 0.04 // Increased from 0.015
          for (let i = 0; i < 150; i++) { // More particles
            const x = Math.random() * canvas.width
            const y = Math.random() * canvas.height
            ctx.fillStyle = particles[0]?.color || '#d946ef'
            ctx.fillRect(x, y, 1.5, 1.5) // Slightly larger
          }
          ctx.restore()
        }
      } else {
        // Film grain and light rays for video mode
        particles.forEach((particle) => {
          particle.update()
          
          // Vertical light rays
          ctx.save()
          const gradient = ctx.createLinearGradient(
            particle.x,
            0,
            particle.x,
            canvas.height
          )
          
          // Light mode: more visible warmer rays
          const rayOpacity = isDark ? '10' : '08'
          gradient.addColorStop(0, 'transparent')
          gradient.addColorStop(0.5, particle.color + rayOpacity)
          gradient.addColorStop(1, 'transparent')
          ctx.fillStyle = gradient
          ctx.fillRect(particle.x - 1, 0, 2, canvas.height)
          ctx.restore()
        })
        
        // Light mode only: Add warm dust particles (more visible)
        if (!isDark) {
          const time = currentTime * 0.0003
          particles.slice(0, 25).forEach((particle, i) => { // More particles
            ctx.save()
            const floatY = Math.sin(time + i) * 20
            const wave = Math.cos(time * 2 + i * 0.8) * 0.4 + 0.6
            ctx.globalAlpha = 0.1 * wave // Increased from 0.04
            ctx.fillStyle = particle.color
            ctx.beginPath()
            ctx.arc(particle.x, particle.y + floatY, particle.size * 2.5, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          })
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mode, isDark])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
        isDark ? 'opacity-30' : 'opacity-35'
      }`}
      style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
    />
  )
}

