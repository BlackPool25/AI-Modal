'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { DetectionMode } from '@/lib/utils'

interface ModeContextType {
  mode: DetectionMode
  setMode: (mode: DetectionMode) => void
  isDark: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DetectionMode>('text')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Use requestAnimationFrame for smoother updates on mobile
    const updateMode = () => {
      requestAnimationFrame(() => {
        document.documentElement.setAttribute('data-mode', mode)
      })
    }
    
    updateMode()
  }, [mode])

  useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'))

    return () => observer.disconnect()
  }, [])

  return (
    <ModeContext.Provider value={{ mode, setMode, isDark }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
      </NextThemesProvider>
    </ModeContext.Provider>
  )
}

