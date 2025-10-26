# 🚀 Supabase Edge Function Cron Setup Guide

## What We're Doing:
Setting up an automatic file cleanup that runs **every 30 minutes** to delete files older than 30 minutes. This is **100% free** on Supabase and runs automatically forever after setup.

---

## ✅ Step-by-Step Setup (5-10 minutes)

### Step 1: Install Supabase CLI (if not already installed)

Open your terminal and run:

```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

---

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser. Login with your Supabase account.

---

### Step 3: Link Your Project

You need your Supabase project reference ID (find it in your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR-PROJECT-REF`)

```bash
supabase link --project-ref YOUR-PROJECT-REF
```

Replace `YOUR-PROJECT-REF` with your actual project reference.

**Example:**
```bash
supabase link --project-ref abcdefghijklmnop
```

---

### Step 4: Deploy the Edge Function

From your project root directory:

```bash
supabase functions deploy cleanup-files
```

You should see:
```
✓ Deployed Function cleanup-files
```

---

### Step 5: Set Environment Variables

The function needs your service role key. Get it from:
- Supabase Dashboard → Settings → API → `service_role` key (secret)

Set the secret:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Replace `your-service-role-key-here` with your actual service role key.

---

### Step 6: Enable Required Extensions

Go to your **Supabase Dashboard** → **SQL Editor** and run this SQL:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
```

Click **RUN** ✓

---

### Step 7: Store Your Project URL Securely

Still in the **SQL Editor**, run this (replace with your actual project URL):

```sql
-- Store project URL in vault
SELECT vault.create_secret(
  'https://YOUR-PROJECT-REF.supabase.co',
  'project_url'
);

-- Store service role key in vault
SELECT vault.create_secret(
  'your-service-role-key-here',
  'service_role_key'
);
```

**Important:** 
- Replace `YOUR-PROJECT-REF` with your project reference
- Replace `your-service-role-key-here` with your actual service role key

---

### Step 8: Schedule the Cron Job

In the **SQL Editor**, run this to schedule the cleanup every 30 minutes:

```sql
-- Schedule cleanup to run every 30 minutes
SELECT cron.schedule(
  'cleanup-old-files',           -- job name
  '*/30 * * * *',                -- every 30 minutes
  $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') 
             || '/functions/v1/cleanup-files',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key')
      ),
      body := jsonb_build_object('timestamp', now()::text)
    ) AS request_id;
  $$
);
```

Click **RUN** ✓

---

### Step 9: Verify It's Working

Check that the cron job was created:

```sql
-- View all scheduled jobs
SELECT * FROM cron.job;
```

You should see your `cleanup-old-files` job listed.

---

### Step 10: Test It Manually (Optional)

You can test the function immediately without waiting:

```bash
supabase functions invoke cleanup-files
```

Or via curl:
```bash
curl -X POST 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/cleanup-files' \
  -H 'Authorization: Bearer YOUR-SERVICE-ROLE-KEY' \
  -H 'Content-Type: application/json'
```

---

## 🎉 Done! 

Your cleanup function will now run **automatically every 30 minutes** and delete files older than 30 minutes.

---

## 📊 Monitor Function Logs

To see what's happening:

```bash
supabase functions logs cleanup-files --follow
```

Or check logs in the Supabase Dashboard → Edge Functions → cleanup-files → Logs

---

## ⚙️ Customization Options

### Change Schedule Frequency:

Edit the cron schedule in Step 8:

- **Every 10 minutes:** `'*/10 * * * *'`
- **Every hour:** `'0 * * * *'`
- **Every 6 hours:** `'0 */6 * * *'`
- **Once daily at 2am:** `'0 2 * * *'`

### Change File Retention Period:

Edit line 13 in `/supabase/functions/cleanup-files/index.ts`:

```typescript
// Change from 30 to 60 minutes:
const thirtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
```

Then redeploy:
```bash
supabase functions deploy cleanup-files
```

---

## 🔧 Troubleshooting

### Function not running?

1. Check the cron job exists:
   ```sql
   SELECT * FROM cron.job;
   ```

2. Check function logs:
   ```bash
   supabase functions logs cleanup-files
   ```

3. Verify secrets are set:
   ```sql
   SELECT name FROM vault.decrypted_secrets;
   ```

### Delete the cron job:

```sql
SELECT cron.unschedule('cleanup-old-files');
```

---

## 📝 What Gets Cleaned Up

- **Text files** in `text-uploads` bucket
- **Image files** in `image-uploads` bucket
- **Video files** in `video-uploads` bucket
- **Older than 30 minutes** from upload time
- **Database records updated** to reflect deletion

---

## ✅ Benefits of This Setup

✓ **Free** - No cost on Supabase free tier  
✓ **Automatic** - Runs every 30 minutes  
✓ **Reliable** - Built-in retry and error handling  
✓ **Fast** - Low latency (function runs near your DB)  
✓ **No maintenance** - Set it and forget it  

---

## Need Help?

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase Cron Jobs Guide](https://supabase.com/docs/guides/database/extensions/pg_cron)
- Check function logs for errors

---

**Setup completed by:** AI Assistant  
**Date:** October 15, 2025  
**Status:** Ready to deploy 🚀

