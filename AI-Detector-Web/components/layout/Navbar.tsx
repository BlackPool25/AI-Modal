'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X, Moon, Sun, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMode } from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/profile'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Awareness', href: '/awareness' },
  { name: 'Datasets', href: '/datasets' },
  { name: 'Research', href: '/research' },
  { name: 'How It Works', href: '/how-it-works' },
  { name: 'About', href: '/about' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { mode } = useMode()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }, [supabase])

  useEffect(() => {
    setMounted(true)

    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchProfile(user.id)
      }
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowUserMenu(false)
    router.push('/')
    router.refresh()
  }

  if (!mounted) return null

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass dark:glass-dark shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-[80px] h-[80px] flex-shrink-0"
            >
              {/* Light mode logo */}
              <Image
                src="/logo.png"
                alt="DetectX Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              {/* Dark mode logo */}
              <Image
                src="/logo-dark.png"
                alt="DetectX Logo"
                fill
                className="object-contain hidden dark:block"
                priority
                onError={(e) => {
                  // If dark logo doesn't exist, use light logo
                  e.currentTarget.style.display = 'none'
                  const lightLogo = e.currentTarget.previousElementSibling as HTMLElement
                  if (lightLogo) lightLogo.classList.remove('dark:hidden')
                }}
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              DetectX
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-foreground transition-all relative group"
              >
                <span className="inline-block overflow-hidden relative">
                  <span className="block group-hover:animate-slot-spin">
                    {link.name}
                  </span>
                </span>
                <span 
                  className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" 
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>

            {/* Auth buttons or user menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="default">
                    Dashboard
                  </Button>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors min-h-[44px]"
                  >
                    {profile?.avatar_url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                        <Image
                          src={profile.avatar_url}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 flex-shrink-0">
                        <Image
                          src="/default-avatar.svg"
                          alt="Default avatar"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[150px] truncate">
                      {profile?.username || user.email}
                    </span>
                  </button>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-lg shadow-lg overflow-hidden"
                    >
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm hover:bg-white/10 transition-colors min-h-[44px]"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm hover:bg-white/10 transition-colors min-h-[44px]"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="default">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" size="default" className="shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-lg hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden glass dark:glass-dark border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-2">
              {/* Theme toggle for mobile */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/10 transition-all min-h-[44px]"
                aria-label="Toggle theme"
              >
                <span>Theme</span>
                <span className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5" />
                      <span className="text-xs">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5" />
                      <span className="text-xs">Dark</span>
                    </>
                  )}
                </span>
              </button>
              
              {/* Auth buttons or user info for mobile */}
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="px-4 py-3 flex items-center gap-3">
                    {profile?.avatar_url ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                        <Image
                          src={profile.avatar_url}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 flex-shrink-0">
                        <Image
                          src="/default-avatar.svg"
                          alt="Default avatar"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="text-sm truncate">
                      <div className="font-medium">{profile?.username || 'User'}</div>
                      <div className="text-foreground/60 text-xs truncate">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Button variant="default" className="w-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

