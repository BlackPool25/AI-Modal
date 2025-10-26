'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { fadeInUp } from '@/lib/animationVariants'

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@aidetector.com' },
]

const footerLinks = [
  { name: 'Contact', href: '/contact' },
  { name: 'Terms', href: '/terms' },
  { name: 'Privacy', href: '/privacy' },
]

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 glass dark:glass-dark">
      <div className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                {/* Light mode logo */}
                <Image
                  src="/logo.png"
                  alt="DetectX Logo"
                  fill
                  className="object-contain dark:hidden"
                />
                {/* Dark mode logo */}
                <Image
                  src="/logo-dark.png"
                  alt="DetectX Logo"
                  fill
                  className="object-contain hidden dark:block"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const lightLogo = e.currentTarget.previousElementSibling as HTMLElement
                    if (lightLogo) lightLogo.classList.remove('dark:hidden')
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DetectX
              </h3>
            </div>
            <p className="text-sm text-foreground/70">
              Preserving truth in an increasingly synthetic world. Detect AI-generated content with confidence.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-lg glass dark:glass-dark hover:shadow-lg transition-all group"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-foreground/60"
        >
          <p>&copy; {new Date().getFullYear()} DetectX. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

