# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these from your Supabase project settings: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Job Secret (generate a random string)
CRON_SECRET=your-random-secret-string
```

## How to Get Supabase Credentials

1. Go to https://supabase.com and sign up/login
2. Create a new project or select existing one
3. Go to Project Settings > API
4. Copy the following:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret - it bypasses Row Level Security
- Only use `service_role` key in server-side code

