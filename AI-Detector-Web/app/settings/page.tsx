'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/hooks/useProfile'
import { Card } from '@/components/ui/Card'
import { AvatarUpload } from '@/components/settings/AvatarUpload'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { PasswordSection } from '@/components/settings/PasswordSection'
import { DeleteAccountSection } from '@/components/settings/DeleteAccountSection'
import { Loader2, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    createProfile,
  } = useProfile(user?.id)

  const [creatingProfile, setCreatingProfile] = useState(false)
  const [username, setUsername] = useState('')
  const [showCreateProfile, setShowCreateProfile] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [supabase, router])

  // Check if profile needs to be created
  useEffect(() => {
    if (!profileLoading && profileError && user) {
      // Profile doesn't exist, show creation form
      setShowCreateProfile(true)
    }
  }, [profileLoading, profileError, user])

  const handleAvatarUpload = async (file: File) => {
    setUploading(true)
    const result = await uploadAvatar(file)
    setUploading(false)
    return result
  }

  const handleAvatarDelete = async () => {
    setUploading(true)
    const result = await deleteAvatar()
    setUploading(false)
    return result
  }

  const handleProfileUpdate = async (updates: { username?: string; bio?: string }) => {
    return await updateProfile(updates)
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-foreground/60">Loading settings...</p>
        </div>
      </div>
    )
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !username.trim()) return
    
    setCreatingProfile(true)
    
    try {
      const result = await createProfile(username.trim(), user.id)
      
      if (result.success) {
        setShowCreateProfile(false)
        // Reload the page to show the profile
        window.location.reload()
      } else {
        const errorMessage = result.error || 'Failed to create profile'
        // Check for unique constraint violation
        if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint') || errorMessage.includes('already exists')) {
          alert('Username already taken. Please choose another.')
        } else {
          alert(errorMessage)
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create profile. Please try again.'
      if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
        alert('Username already taken. Please choose another.')
      } else {
        alert(errorMessage)
      }
    } finally {
      setCreatingProfile(false)
    }
  }

  if (showCreateProfile && user) {
    return (
      <div className="min-h-screen pt-28 md:pt-32 px-4 md:px-8 lg:px-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">Create Your Profile</h2>
            <p className="text-sm sm:text-base text-foreground/60 mb-4 sm:mb-6 text-center">
              We need to create your profile to continue. Choose a username to get started.
            </p>
            
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                  disabled={creatingProfile}
                  minLength={3}
                  pattern="[a-zA-Z0-9_-]+"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Minimum 3 characters. Letters, numbers, hyphens, and underscores only.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg p-3 text-sm">
                <p className="font-semibold mb-1">Your email: {user.email}</p>
                <p className="text-xs">You can add more details after creating your profile.</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={creatingProfile || !username.trim()}
              >
                {creatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  if (profileError && !showCreateProfile) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error Loading Profile
            </h2>
            <p className="text-foreground/60 mb-6">
              {profileError || 'Unable to load your profile. Please try again.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-foreground/60">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-base md:text-lg text-foreground/70">
            Manage your profile and account preferences
          </p>
        </motion.div>

        <div className="space-y-4 md:space-y-6">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Profile Photo</h2>
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                onUpload={handleAvatarUpload}
                onDelete={handleAvatarDelete}
                uploading={uploading}
              />
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <ProfileSection
                username={profile.username}
                bio={profile.bio}
                email={user.email}
                onUpdate={handleProfileUpdate}
              />
            </Card>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <PasswordSection />
            </Card>
          </motion.div>

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Account Information</h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Account created:</span>
                  </div>
                  <span className="font-medium sm:ml-auto">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Last updated:</span>
                  </div>
                  <span className="font-medium sm:ml-auto">
                    {new Date(profile.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Delete Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 sm:p-6 md:p-8 border-red-500/20">
              <DeleteAccountSection />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

