export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          username: string
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string
          bio?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      detection_history: {
        Row: {
          id: string
          user_id: string
          filename: string
          file_type: 'text' | 'image' | 'video'
          file_size: number
          file_extension: string
          file_url: string | null
          detection_result: string
          confidence_score: number
          model_used: string
          created_at: string
          file_deleted_at: string | null
          is_file_available: boolean
        }
        Insert: {
          id?: string
          user_id: string
          filename: string
          file_type: 'text' | 'image' | 'video'
          file_size: number
          file_extension: string
          file_url?: string | null
          detection_result: string
          confidence_score: number
          model_used?: string
          created_at?: string
          file_deleted_at?: string | null
          is_file_available?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          filename?: string
          file_type?: 'text' | 'image' | 'video'
          file_size?: number
          file_extension?: string
          file_url?: string | null
          detection_result?: string
          confidence_score?: number
          model_used?: string
          created_at?: string
          file_deleted_at?: string | null
          is_file_available?: boolean
        }
      }
    }
  }
}

