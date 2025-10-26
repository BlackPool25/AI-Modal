'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Loader2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileSectionProps {
  username: string
  bio: string | null
  email: string
  onUpdate: (updates: { username?: string; bio?: string }) => Promise<{ success: boolean; error?: string }>
}

export function ProfileSection({ username, bio, email, onUpdate }: ProfileSectionProps) {
  const [formData, setFormData] = useState({
    username: username,
    bio: bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field: 'username' | 'bio', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    setSuccess(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate username
      if (formData.username.trim().length < 3) {
        throw new Error('Username must be at least 3 characters')
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        throw new Error('Username can only contain letters, numbers, hyphens, and underscores')
      }

      const updates: { username?: string; bio?: string } = {}
      
      if (formData.username !== username) {
        updates.username = formData.username.trim()
      }
      
      if (formData.bio !== (bio || '')) {
        updates.bio = formData.bio.trim() || null as any
      }

      if (Object.keys(updates).length === 0) {
        setHasChanges(false)
        return
      }

      const result = await onUpdate(updates)

      if (result.success) {
        setSuccess(true)
        setHasChanges(false)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error(result.error || 'Update failed')
      }
    } catch (err: any) {
      // Check for unique constraint violation
      const errorMessage = err.message || 'Failed to update profile'
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        setError('Username already taken. Please choose another.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        
        <div className="space-y-4">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
            />
            <p className="text-xs text-foreground/60 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter username"
              required
              disabled={saving}
              minLength={3}
              pattern="[a-zA-Z0-9_-]+"
            />
            <p className="text-xs text-foreground/60 mt-1">
              Minimum 3 characters. Letters, numbers, hyphens, and underscores only.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio
            </label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              disabled={saving}
              maxLength={500}
            />
            <p className="text-xs text-foreground/60 mt-1 text-right">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-3 text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <Button
        type="submit"
        variant="default"
        disabled={saving || !hasChanges}
        className="w-full sm:w-auto"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  )
}

