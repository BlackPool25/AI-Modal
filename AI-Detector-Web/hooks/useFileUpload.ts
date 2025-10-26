import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { validateFile, getBucketName } from '@/lib/fileValidation'
import type { UploadedFile } from '@/types/detection'

export function useFileUpload(mode: 'text' | 'image' | 'video') {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    setError(null)
    setUploading(true)

    try {
      // 1. Validate file
      const validation = validateFile(file, mode)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // 2. Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Not authenticated. Please login to upload files.')
      }

      // 3. Upload to bucket
      const bucket = getBucketName(mode)
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '1800', // 30 minutes
          upsert: false
        })

      if (uploadError) throw uploadError

      // 4. Get public URL (temporary)
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return {
        path: uploadData.path,
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: mode,
        fileExtension: '.' + file.name.split('.').pop()!
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading, error }
}

