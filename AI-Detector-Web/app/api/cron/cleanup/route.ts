import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Find files older than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    
    const { data: records, error: fetchError } = await supabase
      .from('detection_history')
      .select('id, file_url, file_type, user_id')
      .eq('is_file_available', true)
      .lt('created_at', thirtyMinutesAgo)

    if (fetchError) {
      throw fetchError
    }

    if (!records || records.length === 0) {
      return NextResponse.json({ 
        message: 'No files to delete', 
        deleted: 0 
      })
    }

    let deletedCount = 0
    const errors: string[] = []

    // Delete files from storage and update database
    for (const record of records) {
      try {
        if (!record.file_url) continue

        // Extract file path from URL
        const bucket = `${record.file_type}-uploads`
        const urlParts = record.file_url.split('/')
        const pathIndex = urlParts.indexOf('object') + 2 // After /storage/v1/object/public/bucket-name/
        const filePath = urlParts.slice(pathIndex).join('/')

        // Delete file from storage
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([filePath])

        if (deleteError) {
          throw deleteError
        }

        // Update database record
        const { error: updateError } = await supabase
          .from('detection_history')
          .update({ 
            file_url: null, 
            is_file_available: false,
            file_deleted_at: new Date().toISOString()
          })
          .eq('id', record.id)

        if (updateError) {
          throw updateError
        }

        deletedCount++
      } catch (err: any) {
        console.error(`Error deleting file ${record.id}:`, err)
        errors.push(`File ${record.id}: ${err.message}`)
      }
    }

    return NextResponse.json({ 
      success: true,
      deleted: deletedCount,
      total: records.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (err: any) {
    console.error('Cleanup cron error:', err)
    return NextResponse.json(
      { 
        success: false, 
        error: err.message || 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

