# Supabase Integration Plan for DetectX

## Phase 1: Supabase Setup & Configuration

### 1.1 Create Supabase Project

- Sign up at https://supabase.com
- Create new project: "DetectX" (or your preferred name)
- Note down: Project URL and anon/public key
- Region: Choose closest to your users (e.g., US East)

### 1.2 Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install --save-dev @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 1.3 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Add `.env.local` to `.gitignore` (already should be there)

## Phase 2: Database Schema Setup

### 2.1 PostgreSQL Tables (via Supabase SQL Editor)

**Table: detection_history**

```sql
create table public.detection_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  file_type text not null, -- 'text', 'image', 'video'
  file_size bigint not null,
  file_extension text not null,
  file_url text, -- temporary URL, deleted after 30 min
  detection_result text not null, -- JSON: {confidence, isAI, label}
  confidence_score numeric(5,2) not null,
  model_used text default 'DetectX-v1',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  file_deleted_at timestamp with time zone, -- when file was auto-deleted
  is_file_available boolean default true
);

-- Enable RLS
alter table public.detection_history enable row level security;

-- Users can only see their own history
create policy "Users can view own history"
  on public.detection_history for select
  using (auth.uid() = user_id);

-- Users can only insert their own records
create policy "Users can insert own records"
  on public.detection_history for insert
  with check (auth.uid() = user_id);

-- Create index for faster queries
create index detection_history_user_id_idx on public.detection_history(user_id);
create index detection_history_created_at_idx on public.detection_history(created_at desc);
```

### 2.2 Enable pg_cron Extension

```sql
-- Enable pg_cron extension (requires Supabase Pro or run as service role)
-- For free tier, use Edge Function alternative (see Phase 6)
-- create extension if not exists pg_cron;
```

## Phase 3: Storage Buckets Setup

### 3.1 Create Storage Buckets (via Supabase Dashboard > Storage)

Create 3 separate buckets:

1. **text-uploads** - For .txt, .pdf, .docx files
2. **image-uploads** - For .jpg, .png, .webp files  
3. **video-uploads** - For .mp4 files

### 3.2 Bucket Policies (via Storage > Policies)

For each bucket, create policies:

```sql
-- Allow authenticated users to upload
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their own files
create policy "Users can read own files"
  on storage.objects for select
  using (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own files
create policy "Users can delete own files"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Repeat for image-uploads and video-uploads buckets
```

### 3.3 File Size Limits

Configure in Supabase Dashboard > Storage > Settings:

- Max file size: 100MB (or adjust based on needs)

## Phase 4: Authentication Implementation

### 4.1 Supabase Client Setup

Create `lib/supabase/client.ts`:

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => createClientComponentClient<Database>()
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })
```

### 4.2 Auth Pages

**Create `app/auth/login/page.tsx`:**

```typescript
'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md glass dark:glass-dark rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login to DetectX</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // Email/password only for now
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </div>
    </div>
  )
}
```

**Create `app/auth/signup/page.tsx`:** (similar structure, change view to 'sign_up')

**Create `app/auth/callback/route.ts`:**

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
```

### 4.3 Update Navbar Component

Modify `components/layout/Navbar.tsx`:

- Replace Login/Sign Up buttons with auth-aware versions
- Show user email and logout when authenticated
- Add dashboard link for authenticated users

## Phase 5: File Upload with Validation & Storage

### 5.1 File Validation Utility

Create `lib/fileValidation.ts`:

```typescript
export const FILE_FORMATS = {
  text: {
    extensions: ['.txt', '.pdf', '.docx'],
    mimeTypes: ['text/plain', 'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  image: {
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  video: {
    extensions: ['.mp4'],
    mimeTypes: ['video/mp4'],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
}

export function validateFile(file: File, mode: 'text' | 'image' | 'video') {
  const config = FILE_FORMATS[mode]
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  // Check extension
  if (!config.extensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file format. Accepted: ${config.extensions.join(', ')}`
    }
  }
  
  // Check MIME type
  if (!config.mimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload a valid ${mode} file.`
    }
  }
  
  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${config.maxSize / 1024 / 1024}MB`
    }
  }
  
  return { valid: true }
}

export function getBucketName(mode: 'text' | 'image' | 'video') {
  return `${mode}-uploads`
}
```

### 5.2 Upload Hook

Create `hooks/useFileUpload.ts`:

```typescript
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { validateFile, getBucketName } from '@/lib/fileValidation'

export function useFileUpload(mode: 'text' | 'image' | 'video') {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadFile = async (file: File) => {
    setError(null)
    setUploading(true)

    try {
      // 1. Validate file
      const validation = validateFile(file, mode)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // 2. Get user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

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
        fileExtension: '.' + file.name.split('.').pop()
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setUploading(false)
    }
  }

  return { uploadFile, uploading, error }
}
```

### 5.3 Update UploadModal Component

Modify `components/home/UploadModal.tsx`:

- Add file format validation before upload
- Show specific error messages for wrong formats
- Integrate with useFileUpload hook
- Save detection results to database
- Display user-friendly validation errors

Key changes:

```typescript
// Add validation before upload
const validation = validateFile(file, mode)
if (!validation.valid) {
  setError(validation.error)
  return
}

// Upload file
const uploadedFile = await uploadFile(file)

// Run detection (mock for now)
const result = await runDetection(uploadedFile)

// Save to database
await saveDetectionHistory({
  filename: uploadedFile.fileName,
  file_type: mode,
  file_size: uploadedFile.fileSize,
  file_extension: uploadedFile.fileExtension,
  file_url: uploadedFile.url,
  detection_result: JSON.stringify(result),
  confidence_score: result.confidence,
  model_used: 'DetectX-v1'
})
```

## Phase 6: Auto-Delete Files After 30 Minutes

### 6.1 Option A: Supabase Edge Function (Recommended for Free Tier)

Create Edge Function via Supabase Dashboard or CLI:

**File: `supabase/functions/cleanup-old-files/index.ts`:**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Find files older than 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  
  const { data: records } = await supabase
    .from('detection_history')
    .select('id, file_url, file_type')
    .eq('is_file_available', true)
    .lt('created_at', thirtyMinutesAgo)

  if (!records) return new Response('No files to delete', { status: 200 })

  // Delete files from storage
  for (const record of records) {
    const bucket = `${record.file_type}-uploads`
    const path = new URL(record.file_url).pathname.split('/').slice(-2).join('/')
    
    await supabase.storage.from(bucket).remove([path])
    
    // Update database record
    await supabase
      .from('detection_history')
      .update({ 
        file_url: null, 
        is_file_available: false,
        file_deleted_at: new Date().toISOString()
      })
      .eq('id', record.id)
  }

  return new Response(JSON.stringify({ deleted: records.length }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

**Setup cron trigger:**

- In Supabase Dashboard > Edge Functions
- Deploy the function
- Create a cron job (via external service like cron-job.org or Vercel Cron) to call this function every 5-10 minutes

### 6.2 Option B: Vercel Cron Job (If deployed on Vercel)

Create `app/api/cron/cleanup/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Same cleanup logic as Edge Function above
  // ...

  return NextResponse.json({ success: true })
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "*/10 * * * *"
  }]
}
```

## Phase 7: User Dashboard & History

### 7.1 Create Dashboard Page

Create `app/dashboard/page.tsx`:

```typescript
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadHistory() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data } = await supabase
        .from('detection_history')
        .select('*')
        .order('created_at', { ascending: false })

      setHistory(data || [])
      setLoading(false)
    }

    loadHistory()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Detection History</h1>
      {/* Display history in cards/table */}
      {/* Show: filename, date, confidence, result, download button (if file available) */}
    </div>
  )
}
```

### 7.2 Protected Route Middleware

Create `middleware.ts` in root:

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()

  // Protect /dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

## Phase 8: TypeScript Types

### 8.1 Generate Supabase Types

```bash
npx supabase gen types typescript --project-id your-project-ref > types/supabase.ts
```

### 8.2 Create Custom Types

Create `types/detection.ts`:

```typescript
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
}
```

## Phase 9: Testing & Security

### 9.1 Test Checklist

- [ ] User signup works
- [ ] User login works
- [ ] File upload with correct format succeeds
- [ ] File upload with wrong format shows error
- [ ] File appears in correct bucket
- [ ] Detection result saves to database
- [ ] User can view their history
- [ ] Files auto-delete after 30 minutes
- [ ] Database updates after file deletion
- [ ] User cannot access other users' files
- [ ] User cannot access other users' history

### 9.2 Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Storage bucket policies restrict access
- [ ] Service role key kept in server-side env only
- [ ] File validation on both client and server
- [ ] MIME type validation enforced
- [ ] File size limits enforced
- [ ] SQL injection prevention (using Supabase client)

## What You Need to Provide

1. **Supabase Account Details:**

   - Project URL
   - Anon/Public Key
   - Service Role Key (keep secret!)

2. **Decisions:**

   - Preferred cleanup method (Edge Function vs Vercel Cron)
   - Max file sizes per type (current plan: 10MB text/image, 100MB video)
   - Retention period for detection results (recommend: permanent)

3. **Optional (Future):**

   - OAuth provider credentials (Google, GitHub)
   - Custom domain for auth redirects
   - Email templates for Supabase Auth

## Implementation Todos

1. Set up Supabase project and get credentials
2. Install npm dependencies
3. Create database schema in Supabase SQL Editor
4. Create storage buckets with policies
5. Create Supabase client utilities
6. Build auth pages (login, signup, callback)
7. Update Navbar with auth state
8. Create file validation utility
9. Create upload hook with bucket logic
10. Update UploadModal with validation and storage
11. Implement auto-delete mechanism (Edge Function or Vercel Cron)
12. Build user dashboard with history
13. Add protected route middleware
14. Generate TypeScript types
15. Test all functionality
16. Deploy and verify in production