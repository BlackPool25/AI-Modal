'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function DeleteAccountSection() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteAccount = async () => {
    setError(null)

    // Validate password is entered
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    // Validate confirmation text
    if (confirmText !== 'delete-my-account') {
      setError('Please type "delete-my-account" exactly to confirm')
      return
    }

    setDeleting(true)

    try {
      // First, verify the password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        throw new Error('Unable to verify user')
      }

      // Verify password by attempting sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      })

      if (signInError) {
        throw new Error('Incorrect password. Please try again.')
      }

      // Delete user profile first (due to foreign key constraints)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)

      if (profileError) {
        console.error('Error deleting profile:', profileError)
        // Continue even if profile deletion fails
      }

      // Delete detection history
      const { error: historyError } = await supabase
        .from('detection_history')
        .delete()
        .eq('user_id', user.id)

      if (historyError) {
        console.error('Error deleting history:', historyError)
        // Continue even if history deletion fails
      }

      // Get the session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('No active session')
      }

      // Call the API route to delete the user account
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ password })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account')
      }

      // Sign out locally
      await supabase.auth.signOut()

      // Redirect to home with success message
      router.push('/?account_deleted=true')
      router.refresh()
    } catch (err: any) {
      console.error('Delete account error:', err)
      setError(err.message || 'Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const resetModal = () => {
    setPassword('')
    setConfirmText('')
    setError(null)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div>
        <h3 className="text-base md:text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
          Danger Zone
        </h3>
        <p className="text-xs md:text-sm text-foreground/60 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          variant="outline"
          className="border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10"
        >
          Delete Account
        </Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={resetModal}
        title="Delete Account"
      >
        <div className="space-y-4">
          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Warning: This action cannot be undone!
                </p>
                <p className="text-xs text-foreground/70">
                  This will permanently delete your account and remove all of your data including:
                </p>
                <ul className="text-xs text-foreground/70 list-disc list-inside space-y-1 ml-2">
                  <li>Your profile and settings</li>
                  <li>All detection history</li>
                  <li>Uploaded files and analysis results</li>
                  <li>Your username and all associated data</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Password Input */}
          <div>
            <label htmlFor="delete-password" className="block text-sm font-medium mb-2">
              Confirm your password
            </label>
            <Input
              id="delete-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={deleting}
              required
            />
          </div>

          {/* Confirmation Text Input */}
          <div>
            <label htmlFor="delete-confirm" className="block text-sm font-medium mb-2">
              Type <span className="font-mono text-red-600 dark:text-red-400">delete-my-account</span> to confirm
            </label>
            <Input
              id="delete-confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="delete-my-account"
              disabled={deleting}
              required
            />
            <p className="text-xs text-foreground/60 mt-1">
              Type exactly as shown above (case-sensitive)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              onClick={resetModal}
              variant="outline"
              disabled={deleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleting || !password || confirmText !== 'delete-my-account'}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting Account...
                </>
              ) : (
                'Delete My Account'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
