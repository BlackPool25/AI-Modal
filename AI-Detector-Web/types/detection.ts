export interface DetectionResult {
  confidence: number
  isAI: boolean
  label: string
  model: string
}

export interface DetectionHistory {
  id: string
  filename: string
  file_type: 'text' | 'image' | 'video'
  file_size: number
  file_extension: string
  file_url: string | null
  detection_result: DetectionResult
  confidence_score: number
  model_used: string
  created_at: string
  is_file_available: boolean
  file_deleted_at: string | null
}

export interface UploadedFile {
  path: string
  url: string
  fileName: string
  fileSize: number
  fileType: 'text' | 'image' | 'video'
  fileExtension: string
}

