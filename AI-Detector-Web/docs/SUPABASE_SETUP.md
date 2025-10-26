# Supabase Setup Guide

This guide will walk you through setting up Supabase for the DetectX application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. This project cloned locally

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter project details:
   - Name: `DetectX` (or your preferred name)
   - Database Password: (generate a strong password and save it)
   - Region: Choose closest to your users (e.g., `US East (North Virginia)`)
4. Click "Create new project" and wait for setup to complete

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)
   - **service_role** key (under Project API keys - keep this secret!)

3. Create a `.env.local` file in the root of this project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CRON_SECRET=generate-a-random-secret-string
```

> **Security Note:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 3: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Create detection_history table
create table public.detection_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  file_type text not null check (file_type in ('text', 'image', 'video')),
  file_size bigint not null,
  file_extension text not null,
  file_url text,
  detection_result text not null,
  confidence_score numeric(5,2) not null,
  model_used text default 'DetectX-v1',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  file_deleted_at timestamp with time zone,
  is_file_available boolean default true
);

-- Enable Row Level Security (RLS)
alter table public.detection_history enable row level security;

-- Create RLS policies
-- Users can only view their own history
create policy "Users can view own history"
  on public.detection_history for select
  using (auth.uid() = user_id);

-- Users can only insert their own records
create policy "Users can insert own records"
  on public.detection_history for insert
  with check (auth.uid() = user_id);

-- Users can update their own records
create policy "Users can update own records"
  on public.detection_history for update
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index detection_history_user_id_idx on public.detection_history(user_id);
create index detection_history_created_at_idx on public.detection_history(created_at desc);
create index detection_history_file_available_idx on public.detection_history(is_file_available, created_at);

-- Add helpful comments
comment on table public.detection_history is 'Stores AI detection results for each user upload';
comment on column public.detection_history.detection_result is 'JSON string containing detection analysis';
comment on column public.detection_history.file_url is 'Temporary URL, auto-deleted after 30 minutes';
```

4. Click "Run" to execute the SQL
5. Verify the table was created by checking the **Table Editor**

## Step 4: Create Storage Buckets

1. In your Supabase dashboard, go to **Storage**
2. Click "New bucket"
3. Create the following buckets (one at a time):

### Bucket 1: text-uploads
- **Name:** `text-uploads`
- **Public bucket:** ✓ Enabled
- Click "Create bucket"

### Bucket 2: image-uploads
- **Name:** `image-uploads`
- **Public bucket:** ✓ Enabled
- Click "Create bucket"

### Bucket 3: video-uploads
- **Name:** `video-uploads`
- **Public bucket:** ✓ Enabled
- Click "Create bucket"

## Step 5: Configure Storage Policies

For **each bucket** created above, add the following policies:

1. Click on the bucket name
2. Go to **Policies** tab
3. Click "New policy"
4. Choose "For full customization"

### Policy 1: Allow authenticated uploads

```sql
-- Replace 'text-uploads' with the actual bucket name for each bucket
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Policy 2: Allow users to read their own files

```sql
create policy "Users can read own files"
  on storage.objects for select
  using (
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Policy 3: Allow users to delete their own files

```sql
create policy "Users can delete own files"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

> **Repeat** these policies for `image-uploads` and `video-uploads` buckets, replacing `'text-uploads'` with the appropriate bucket name.

## Step 6: Configure Storage Settings

1. Go to **Storage** > **Settings**
2. Set the following:
   - **Max file size:** 100 MB (or adjust based on your needs)
   - **Allowed MIME types:** Leave as default or customize

## Step 7: Configure Authentication

1. Go to **Authentication** > **Settings**
2. Under **Email Auth**:
   - ✓ Enable Email provider
   - Configure email templates (optional)
3. Under **Auth Providers** (optional for future):
   - Enable Google, GitHub, etc. if desired

### Email Confirmation (Optional)

By default, Supabase requires email confirmation. To disable for testing:

1. Go to **Authentication** > **Settings** > **Email**
2. Toggle "Enable email confirmations" OFF (for development only)
3. For production, keep it ON and configure email templates

## Step 8: Test the Setup

1. Ensure all environment variables are in `.env.local`
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Navigate to http://localhost:3000
4. Try signing up with a test account
5. Upload a file and check:
   - File appears in Storage bucket
   - Record appears in `detection_history` table
   - Dashboard shows the detection result

## Step 9: Set Up Auto-Delete (Vercel Cron)

The cron job is already configured in `vercel.json`. When you deploy to Vercel:

1. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`

2. The cron job will run automatically every 10 minutes
3. It will delete files older than 30 minutes and update the database

### Testing the Cron Job Locally

```bash
# Set the CRON_SECRET in .env.local, then test with:
curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/cleanup
```

## Troubleshooting

### Issue: "relation 'detection_history' does not exist"
**Solution:** Make sure you ran the SQL in Step 3 successfully.

### Issue: "new row violates row-level security policy"
**Solution:** Ensure RLS policies are created correctly and you're authenticated.

### Issue: "Failed to upload file"
**Solution:** 
- Check storage policies are configured
- Verify bucket names match exactly (`text-uploads`, `image-uploads`, `video-uploads`)
- Ensure you're authenticated

### Issue: "Invalid API key"
**Solution:** 
- Verify environment variables are correct
- Restart dev server after changing `.env.local`
- Check for typos in the keys

## Next Steps

✅ Database tables created  
✅ Storage buckets configured  
✅ Authentication enabled  
✅ Auto-delete cron job set up  

You're ready to use DetectX! 🎉

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

