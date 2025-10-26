# IMPORTANT: Setup Required!

## The Error You're Seeing

```
Unable to delete account. Please contact support.
```

This means the delete account feature requires the service role key to be configured.

## Fix: No SQL Required!

The delete account feature now uses an API route instead of a database function.

### What You Need

Make sure your `.env.local` file has the `SUPABASE_SERVICE_ROLE_KEY`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ← Make sure this is set!
```

### Where to Find the Service Role Key

1. Go to: https://app.supabase.com/project/cjkcwycnetdhumtqthuk/settings/api
2. Scroll to **Project API keys**
3. Copy the `service_role` key (keep it secret!)
4. Add it to your `.env.local` file

### Deploy to Vercel

Also add the `SUPABASE_SERVICE_ROLE_KEY` to your Vercel environment variables:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**  
4. Add `SUPABASE_SERVICE_ROLE_KEY` with the value from Supabase

### That's It! ✅

No SQL commands needed. The feature uses the Supabase Admin API to delete users securely.

---

## Why This Is Needed

Supabase doesn't allow users to delete their own auth account by default (security feature).

This function:
- Runs with elevated permissions (`SECURITY DEFINER`)
- But only allows users to delete **their own** account (`auth.uid()` check)
- Deletes all associated data in the correct order
- Is completely safe and secure

## Troubleshooting

### Still getting an error?

1. **Check if SQL ran successfully**
   - Go to Supabase SQL Editor
   - Run: `SELECT routine_name FROM information_schema.routines WHERE routine_name = 'delete_user';`
   - Should return `delete_user`

2. **Verify permissions**
   - Run: `SELECT has_function_privilege('authenticated', 'delete_user()', 'EXECUTE');`
   - Should return `true`

3. **Check for errors in SQL**
   - Make sure you copied the entire SQL block
   - No syntax errors in the editor
   - Click RUN again

### Need Help?

The full SQL is also in:
- `/docs/DELETE_USER_FUNCTION.md`
- `/docs/DELETE_ACCOUNT_QUICKSTART.md`
