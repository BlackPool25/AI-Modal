import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

serve(async (req) => {
  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Find files older than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
    
    console.log('Starting cleanup for files older than:', thirtyMinutesAgo)
    
    const { data: records, error: fetchError } = await supabase
      .from('detection_history')
      .select('id, file_url, file_type, user_id')
      .eq('is_file_available', true)
      .lt('created_at', thirtyMinutesAgo)

    if (fetchError) {
      console.error('Fetch error:', fetchError)
      throw fetchError
    }

    if (!records || records.length === 0) {
      console.log('No files to delete')
      return new Response(
        JSON.stringify({ 
          message: 'No files to delete', 
          deleted: 0 
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`Found ${records.length} files to clean up`)
    
    let deletedCount = 0
    const errors: string[] = []

    // Delete files from storage and update database
    for (const record of records) {
      try {
        if (!record.file_url) continue

        // Extract file path from URL
        const bucket = `${record.file_type}-uploads`
        const urlParts = record.file_url.split('/')
        const pathIndex = urlParts.indexOf('object') + 2
        const filePath = urlParts.slice(pathIndex).join('/')

        console.log(`Deleting file: ${filePath} from bucket: ${bucket}`)

        // Delete file from storage
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([filePath])

        if (deleteError) {
          console.error(`Storage delete error for ${record.id}:`, deleteError)
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
          console.error(`DB update error for ${record.id}:`, updateError)
          throw updateError
        }

        deletedCount++
      } catch (err: any) {
        console.error(`Error deleting file ${record.id}:`, err)
        errors.push(`File ${record.id}: ${err.message}`)
      }
    }

    console.log(`Cleanup complete. Deleted: ${deletedCount}/${records.length}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        deleted: deletedCount,
        total: records.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (err: any) {
    console.error('Cleanup function error:', err)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: err.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

