'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Image, Video, X, Loader2, AlertCircle } from 'lucide-react'
import { useMode } from '@/components/providers/ThemeProvider'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { getModeColors, DetectionMode } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validateFile } from '@/lib/fileValidation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { DetectionResult } from '@/types/detection'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const modeConfig: Record<
  DetectionMode,
  {
    icon: React.ElementType
    accept: string
    description: string
  }
> = {
  text: {
    icon: FileText,
    accept: '.txt,.doc,.docx,.pdf',
    description: 'Upload text files (TXT, DOC, DOCX, PDF)',
  },
  image: {
    icon: Image,
    accept: 'image/*',
    description: 'Upload image files (JPG, PNG, GIF, WebP)',
  },
  video: {
    icon: Video,
    accept: 'video/*',
    description: 'Upload video files (MP4, MOV, AVI, WebM)',
  },
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const { mode, isDark } = useMode()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { uploadFile, uploading } = useFileUpload(mode)
  const supabase = createClient()
  const router = useRouter()

  const config = modeConfig[mode]
  const Icon = config.icon

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setError(null)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Validate file before setting
      const validation = validateFile(droppedFile, mode)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }
      setFile(droppedFile)
    }
  }, [mode])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file before setting
      const validation = validateFile(selectedFile, mode)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        return
      }
      setFile(selectedFile)
    }
  }, [mode])

  const handleUpload = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please login to analyze files')
        setIsAnalyzing(false)
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login')
          handleClose()
        }, 2000)
        return
      }

      // Upload file to Supabase Storage
      const uploadedFile = await uploadFile(file)

      // Simulate AI detection (replace with actual API call in production)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock detection result
      const confidence = Math.floor(Math.random() * 30) + 70
      const isAI = confidence > 50
      const detectionResult: DetectionResult = {
        confidence,
        isAI,
        label: isAI ? 'AI-Generated Content Detected' : 'Authentic Human Content',
        model: 'DetectX-v1'
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('detection_history')
        .insert({
          user_id: user.id,
          filename: uploadedFile.fileName,
          file_type: mode,
          file_size: uploadedFile.fileSize,
          file_extension: uploadedFile.fileExtension,
          file_url: uploadedFile.url,
          detection_result: JSON.stringify(detectionResult),
          confidence_score: confidence,
          model_used: 'DetectX-v1'
        })

      if (dbError) throw dbError

      setResult(detectionResult)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to analyze file. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    setIsAnalyzing(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div
              className="p-4 rounded-full glass dark:glass-dark"
              style={{
                boxShadow: `0 0 20px ${getModeColors(mode, isDark)}30`,
              }}
            >
              <Icon
                className="w-8 h-8"
                style={{ color: getModeColors(mode, isDark) }}
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold">
            Upload {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </h2>
          <p className="text-sm text-foreground/60">{config.description}</p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Upload area */}
        {!result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group',
              isDragging
                ? 'border-primary bg-primary/10 scale-105'
                : 'border-foreground/20 hover:border-primary/50 hover:bg-primary/5'
            )}
          >
            <input
              type="file"
              accept={config.accept}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />

            <div className="text-center space-y-3">
              <Upload className="w-12 h-12 mx-auto text-foreground/40 group-hover:text-primary transition-colors" />
              <div>
                <p className="font-medium">
                  {file ? file.name : 'Click to upload or drag files here'}
                </p>
                <p className="text-sm text-foreground/60 mt-1">
                  Maximum file size: 100MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="font-medium">Analyzing...</span>
            </div>
            <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div
              className={cn(
                'p-6 rounded-xl',
                result.isAI
                  ? 'bg-red-500/10 border border-red-500/20'
                  : 'bg-green-500/10 border border-green-500/20'
              )}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="text-5xl font-bold mb-2"
              >
                {result.confidence}%
              </motion.div>
              <p className="text-lg font-semibold">
                {result.isAI ? 'AI-Generated' : 'Human Created'}
              </p>
              <p className="text-sm text-foreground/60 mt-1">
                {result.label}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Confidence Level</span>
                <span className="font-medium">{result.confidence}%</span>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full',
                    result.isAI
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  )}
                  initial={{ width: '0%' }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!result ? (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleUpload}
                className="flex-1"
                disabled={!file || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null)
                  setResult(null)
                }}
                className="flex-1"
              >
                Upload Another
              </Button>
              <Button variant="default" onClick={handleClose} className="flex-1">
                Done
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

