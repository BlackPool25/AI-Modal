'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { DetectionHistory } from '@/types/detection'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatFileSize } from '@/lib/fileValidation'
import { FileText, Image as ImageIcon, Video, Download, Calendar, Gauge } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [history, setHistory] = useState<DetectionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadHistory() {
      try {
        // Check authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/auth/login')
          return
        }

        // Fetch detection history (limit to most recent 50 for performance)
        const { data, error: historyError } = await supabase
          .from('detection_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (historyError) {
          throw historyError
        }

        // Parse detection results
        const parsedHistory = (data || []).map((item: any) => ({
          ...item,
          detection_result: typeof item.detection_result === 'string' 
            ? JSON.parse(item.detection_result) 
            : item.detection_result
        })) as DetectionHistory[]

        setHistory(parsedHistory)
      } catch (err: any) {
        console.error('Error loading history:', err)
        setError(err.message || 'Failed to load detection history')
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [supabase, router])

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'text':
        return <FileText className="w-6 h-6" />
      case 'image':
        return <ImageIcon className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400'
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getResultBadge = (result: any) => {
    const isAI = result.isAI
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isAI 
          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
          : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
      }`}>
        {isAI ? 'AI Generated' : 'Human Created'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <p className="text-lg font-semibold">Error Loading History</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Detection History
          </h1>
          <p className="text-base md:text-lg text-foreground/70">
            View your most recent AI detection results and analysis
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-foreground/60 mb-1">Total Detections</p>
                <p className="text-2xl md:text-3xl font-bold">{history.length}</p>
              </div>
              <Gauge className="w-8 h-8 md:w-12 md:h-12 text-primary opacity-20" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-foreground/60 mb-1">AI Detected</p>
                <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                  {history.filter(h => h.detection_result.isAI).length}
                </p>
              </div>
              <FileText className="w-8 h-8 md:w-12 md:h-12 text-red-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-foreground/60 mb-1">Human Created</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  {history.filter(h => !h.detection_result.isAI).length}
                </p>
              </div>
              <FileText className="w-8 h-8 md:w-12 md:h-12 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Detection History */}
        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Detection History</h3>
              <p className="text-foreground/60 mb-6">
                You haven't run any detections yet. Upload a file to get started!
              </p>
              <Button onClick={() => router.push('/')}>
                Start Detecting
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 md:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    {/* File Info */}
                    <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="p-2 md:p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                        {getFileIcon(item.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg truncate mb-1">
                          {item.filename}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">
                              {new Date(item.created_at).toLocaleDateString()} at{' '}
                              {new Date(item.created_at).toLocaleTimeString()}
                            </span>
                            <span className="sm:hidden">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>{formatFileSize(item.file_size)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="uppercase">{item.file_extension}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detection Result */}
                    <div className="flex flex-col md:items-end gap-2 md:gap-3">
                      {getResultBadge(item.detection_result)}
                      <div className="flex items-center gap-2">
                        <Gauge className={`w-3 h-3 md:w-4 md:h-4 ${getConfidenceColor(item.confidence_score)}`} />
                        <span className={`text-sm md:text-base font-semibold ${getConfidenceColor(item.confidence_score)}`}>
                          {item.confidence_score}% Confidence
                        </span>
                      </div>
                      {item.is_file_available && item.file_url && (
                        <a 
                          href={item.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs md:text-sm text-primary hover:underline flex items-center gap-1 min-h-[44px] md:min-h-0"
                        >
                          <Download className="w-3 h-3 md:w-4 md:h-4" />
                          Download File
                        </a>
                      )}
                      {!item.is_file_available && (
                        <span className="text-xs text-foreground/40">
                          File deleted (30 min)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-foreground/10">
                    <p className="text-xs text-foreground/50">
                      Analyzed by {item.model_used} • {item.detection_result.label}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

