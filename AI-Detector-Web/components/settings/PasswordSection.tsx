'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loader2, Check, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

export function PasswordSection() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleChange = (field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setUpdating(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match')
      }

      // Validate password length
      if (formData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters')
      }

      // Validate new password is different from current (client-side check only)
      if (formData.currentPassword && formData.currentPassword === formData.newPassword) {
        throw new Error('New password must be different from current password')
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        throw new Error('User not found. Please log in again.')
      }

      // Verify current password by re-authenticating
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.currentPassword,
      })

      if (verifyError) {
        throw new Error('Current password is incorrect')
      }

      // Update to new password (session is already valid)
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (updateError) {
        throw new Error(updateError.message || 'Failed to update password')
      }

      // Success!
      setSuccess(true)
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)

    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <p className="text-sm text-foreground/60 mb-4">
          Update your password. You'll need to enter your current password to confirm.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
            Current Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            placeholder="Enter current password"
            required
            disabled={updating}
            autoComplete="current-password"
          />
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="Enter new password"
            required
            disabled={updating}
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
            required
            disabled={updating}
            minLength={6}
            autoComplete="new-password"
          />
          <p className="text-xs text-foreground/60 mt-1">
            Must be at least 6 characters and different from current password
          </p>
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
              className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-lg p-4 text-sm"
            >
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Password Updated Successfully!</p>
                  <p>
                    Your password has been changed. You can now use your new password to log in.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          disabled={updating || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
          className="w-full sm:w-auto"
        >
          {updating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </div>
  )
}

