'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { validateImageFile, getImagePreviewUrl, revokeImagePreviewUrl } from '@/lib/imageCompression'
import { motion, AnimatePresence } from 'framer-motion'

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  onUpload: (file: File) => Promise<{ success: boolean; error?: string }>
  onDelete?: () => Promise<{ success: boolean; error?: string }>
  uploading?: boolean
}

export function AvatarUpload({ currentAvatarUrl, onUpload, onDelete, uploading = false }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    // Show preview
    const preview = getImagePreviewUrl(file)
    setPreviewUrl(preview)

    // Upload file
    const result = await onUpload(file)
    
    if (!result.success) {
      setError(result.error || 'Upload failed')
      revokeImagePreviewUrl(preview)
      setPreviewUrl(null)
    } else {
      // Clear preview after successful upload
      revokeImagePreviewUrl(preview)
      setPreviewUrl(null)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteAvatar = async () => {
    if (!onDelete) return

    setError(null)
    const result = await onDelete()

    if (!result.success) {
      setError(result.error || 'Delete failed')
    }
  }

  const displayUrl = previewUrl || currentAvatarUrl || '/default-avatar.svg'

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-900 shadow-lg">
          <Image
            src={displayUrl}
            alt="Profile avatar"
            fill
            className="object-cover"
            unoptimized={previewUrl !== null}
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Button Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Upload avatar"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 dark:text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="default"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Button>
        {currentAvatarUrl && onDelete && (
          <Button
            variant="ghost"
            size="default"
            onClick={handleDeleteAvatar}
            disabled={uploading}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      {/* Helper Text */}
      <p className="text-xs text-foreground/60 text-center max-w-xs">
        Upload a photo (max 5MB). It will be automatically compressed and resized.
      </p>
    </div>
  )
}

