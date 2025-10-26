# Quick Start Guide - Supabase Integration

Get DetectX up and running with Supabase in under 15 minutes!

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- A Supabase account (free tier is fine)

## Step 1: Clone & Install (2 minutes)

```bash
cd /home/lightdesk/Projects/AI-Website
npm install
```

✅ Dependencies already installed!

## Step 2: Create Supabase Project (3 minutes)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name:** DetectX (or your choice)
   - **Database Password:** (generate strong password, save it!)
   - **Region:** US East (or closest to you)
4. Click **"Create new project"**
5. Wait ~2 minutes for setup to complete

## Step 3: Get API Credentials (1 minute)

1. In your Supabase project, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep secret!)

## Step 4: Configure Environment (1 minute)

Create `.env.local` file in project root:

```bash
# Create .env.local
touch .env.local
```

Add this content (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
CRON_SECRET=my-random-secret-12345
```

## Step 5: Create Database Table (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy & paste this SQL:

```sql
-- Create table
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

-- Enable RLS
alter table public.detection_history enable row level security;

-- Policies
create policy "Users can view own history"
  on public.detection_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own records"
  on public.detection_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update own records"
  on public.detection_history for update
  using (auth.uid() = user_id);

-- Indexes
create index detection_history_user_id_idx on public.detection_history(user_id);
create index detection_history_created_at_idx on public.detection_history(created_at desc);
create index detection_history_file_available_idx on public.detection_history(is_file_available, created_at);
```

4. Click **"Run"**
5. ✅ Verify success message

## Step 6: Create Storage Buckets (3 minutes)

1. In Supabase, go to **Storage**
2. Click **"New bucket"**
3. Create these 3 buckets:

### Bucket 1: text-uploads
- Name: `text-uploads`
- ✓ Public bucket
- Click "Create"

### Bucket 2: image-uploads
- Name: `image-uploads`
- ✓ Public bucket
- Click "Create"

### Bucket 3: video-uploads
- Name: `video-uploads`
- ✓ Public bucket
- Click "Create"

## Step 7: Set Storage Policies (2 minutes)

For **each bucket**, add these policies:

1. Click bucket → **Policies** → **New policy** → **For full customization**

### Policy 1: Upload (repeat for each bucket)
```sql
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND  -- Change this for each bucket
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Policy 2: Read (repeat for each bucket)
```sql
create policy "Users can read own files"
  on storage.objects for select
  using (
    bucket_id = 'text-uploads' AND  -- Change this for each bucket
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

### Policy 3: Delete (repeat for each bucket)
```sql
create policy "Users can delete own files"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated' AND
    bucket_id = 'text-uploads' AND  -- Change this for each bucket
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Remember:** Replace `'text-uploads'` with `'image-uploads'` and `'video-uploads'` when creating policies for those buckets!

## Step 8: Disable Email Confirmation (Optional - for testing)

1. Go to **Authentication** → **Settings** → **Email**
2. Toggle **"Enable email confirmations"** to **OFF**
3. Click **"Save"**

> ⚠️ For production, keep this ON and configure proper email templates!

## Step 9: Run the App! (1 minute)

```bash
npm run dev
```

Navigate to: http://localhost:3000

## Step 10: Test It Out!

1. **Sign Up**
   - Click "Sign Up" in navbar
   - Enter email & password
   - Create account

2. **Login**
   - Login automatically or click "Login"

3. **Upload a File**
   - Click any mode (Text/Image/Video)
   - Upload a sample file
   - View detection result

4. **Check Dashboard**
   - Click "Dashboard" in navbar
   - See your detection history
   - Download the file (while available)

## 🎉 You're Done!

Your DetectX app is now fully integrated with Supabase!

## Quick Tips

- **View Database:** Supabase Dashboard → Table Editor → detection_history
- **View Files:** Supabase Dashboard → Storage → Select bucket
- **View Users:** Supabase Dashboard → Authentication → Users
- **Test Cleanup:** Wait 30 minutes or manually trigger at `/api/cron/cleanup`

## Common Issues

### Can't sign up?
- Check `.env.local` is in project root
- Restart dev server after creating `.env.local`
- Verify API keys are correct

### Upload fails?
- Ensure all 3 storage buckets exist
- Check storage policies are created for all buckets
- Make sure you're logged in

### Database error?
- Verify SQL script ran successfully
- Check RLS policies are created
- Ensure you're authenticated

## Next Steps

- Read `docs/IMPLEMENTATION_SUMMARY.md` for full details
- See `docs/SUPABASE_SETUP.md` for comprehensive guide
- Deploy to Vercel (see `docs/VERCEL_DEPLOYMENT.md`)

---

Need help? Check the troubleshooting section in `docs/IMPLEMENTATION_SUMMARY.md`

