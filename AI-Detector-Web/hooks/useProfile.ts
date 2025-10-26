import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types/profile'
import { compressImage } from '@/lib/imageCompression'

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchProfile = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      setProfile(data)
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      setError(err.message || 'Failed to load profile')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (userId) {
      fetchProfile(userId)
    } else {
      setLoading(false)
    }
  }, [userId, fetchProfile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) throw new Error('No user ID provided')

    try {
      setError(null)

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      setProfile(data)
      return { success: true, data }
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
      return { success: false, error: err.message }
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!userId) throw new Error('No user ID provided')

    try {
      setError(null)

      // Compress the image
      const compressedFile = await compressImage(file)

      // Upload to Supabase Storage
      const fileName = `${userId}/avatar.webp`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: true, // Replace existing avatar
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with new avatar URL
      const result = await updateProfile({ avatar_url: publicUrl })

      return result
    } catch (err: any) {
      console.error('Error uploading avatar:', err)
      setError(err.message || 'Failed to upload avatar')
      return { success: false, error: err.message }
    }
  }

  const deleteAvatar = async () => {
    if (!userId || !profile?.avatar_url) return { success: false, error: 'No avatar to delete' }

    try {
      setError(null)

      // Delete from storage
      const fileName = `${userId}/avatar.webp`
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName])

      if (deleteError) throw deleteError

      // Update profile to remove avatar URL
      const result = await updateProfile({ avatar_url: null })

      return result
    } catch (err: any) {
      console.error('Error deleting avatar:', err)
      setError(err.message || 'Failed to delete avatar')
      return { success: false, error: err.message }
    }
  }

  const createProfile = async (username: string, userId: string) => {
    try {
      setError(null)

      const { data, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          username,
          bio: null,
          avatar_url: null,
        })
        .select()
        .single()

      if (createError) throw createError

      setProfile(data)
      return { success: true, data }
    } catch (err: any) {
      console.error('Error creating profile:', err)
      setError(err.message || 'Failed to create profile')
      return { success: false, error: err.message }
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    createProfile,
  }
}

