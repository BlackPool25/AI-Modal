# Fix Supabase Email Confirmation Redirect to Production

## Problem
Email confirmation links are redirecting to `localhost:3000` instead of your production Vercel URL.

## Solution

### Step 1: Configure Supabase URL Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `cjkcwycnetdhumtqthuk`
3. Navigate to **Authentication** → **URL Configuration**

### Step 2: Update Site URL

Set the **Site URL** to your production domain:
```
https://ai-detector-web-nu.vercel.app
```

**CRITICAL:** 
- ✅ **MUST** include `https://` protocol
- ✅ **MUST** be the exact domain (no trailing slash)
- ❌ **WRONG:** `ai-detector-web-nu.vercel.app` (missing protocol)
- ❌ **WRONG:** `http://ai-detector-web-nu.vercel.app` (wrong protocol)
- ❌ **WRONG:** `https://ai-detector-web-nu.vercel.app/` (trailing slash)

(Replace with your actual Vercel deployment URL)

### Step 3: Add Redirect URLs

In the **Redirect URLs** section, add BOTH (with full URLs):
```
http://localhost:3000/auth/callback
https://ai-detector-web-nu.vercel.app/auth/callback
```

**CRITICAL:** 
- ✅ **MUST** include full protocol (`http://` or `https://`)
- ✅ **MUST** include the full path `/auth/callback`
- ❌ **WRONG:** `localhost:3000/auth/callback` (missing protocol)
- ❌ **WRONG:** `https://ai-detector-web-nu.vercel.app` (missing path)

**Important:** 
- Keep `localhost` for local development
- Add your production URL for production
- Each URL on a new line or comma-separated

### Step 4: Verify Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Ensure these are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cjkcwycnetdhumtqthuk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   CRON_SECRET=your-random-secret
   ```

### Step 5: Redeploy (if needed)

After updating Supabase settings, test by:
1. Sign up with a new email
2. Check the confirmation email
3. Verify the link points to your production domain

## Common Issues

### Issue: "requested path is invalid" error
**Error in email link:** `{"error":"requested path is invalid"}`

**Cause:** Site URL in Supabase is missing the `https://` protocol

**Solution:** 
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update Site URL to include `https://`:
   - ❌ Wrong: `ai-detector-web-nu.vercel.app`
   - ✅ Correct: `https://ai-detector-web-nu.vercel.app`
3. Save changes
4. Test with a new signup (old confirmation emails won't work)

### Issue: Still redirecting to localhost
**Solution:** Clear your browser cache and cookies, or try in an incognito window

### Issue: "Invalid redirect URL" error
**Solution:** Make sure the exact URL (including `/auth/callback`) is added to Supabase Redirect URLs

### Issue: Email not arriving
**Solution:** 
- Check spam folder
- Verify email settings in Supabase Authentication → Email Templates
- Consider using a custom SMTP provider for production

## Testing

### Local Development
- URL should be: `http://localhost:3000/auth/callback`
- This works because you have localhost in Redirect URLs

### Production
- URL should be: `https://your-app-name.vercel.app/auth/callback`
- This works after adding production URL to Redirect URLs

## Additional Configuration (Optional)

### Custom Domain Setup
If you have a custom domain (e.g., `yourdomain.com`):

1. Add to Redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   ```

2. Update Site URL to:
   ```
   https://yourdomain.com
   ```

### Email Template Customization

1. Go to **Authentication** → **Email Templates**
2. Customize the templates:
   - **Confirm signup**: Edit the confirmation email
   - You can add your branding and custom messaging
3. The `{{ .ConfirmationURL }}` variable will automatically use the correct domain based on your Site URL setting

## How It Works

When a user signs up:
1. Your code calls `supabase.auth.signUp()` with `emailRedirectTo: ${window.location.origin}/auth/callback`
2. Supabase sends an email with a confirmation link
3. The link includes the `redirect_to` parameter based on your **Site URL** setting in Supabase
4. User clicks the link → redirected to `/auth/callback` → exchanges code for session → redirected to dashboard

## Quick Checklist

- [ ] Site URL set to production domain in Supabase
- [ ] Production callback URL added to Redirect URLs
- [ ] Localhost callback URL kept for development
- [ ] Environment variables set in Vercel
- [ ] Tested signup flow in production
- [ ] Email arrives with correct production link
