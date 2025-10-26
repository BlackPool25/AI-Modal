# 🔧 IMMEDIATE FIX: "Error sending recovery email"

## The Problem
You're getting "Error sending recovery email" when trying to reset passwords.

## The Solution (5 Minutes)

### Step 1: Configure Site URL ⚠️ CRITICAL

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to**: Authentication → URL Configuration
4. **Set Site URL** to:
   ```
   http://localhost:3000
   ```
   (No trailing slash!)

5. **Click Save**

### Step 2: Add Redirect URLs ⚠️ CRITICAL

In the same page, scroll to **Redirect URLs** and add:

```
http://localhost:3000/**
```

**Why the `/**`?** This allows ALL paths under localhost:3000.

Click **Save**.

### Step 3: Verify Email Provider is Enabled

1. **Go to**: Authentication → Providers
2. **Find "Email"** in the list
3. **Make sure it's ENABLED** (toggle should be ON)
4. **Optional**: Turn OFF "Confirm email" for testing

### Step 4: Test Using Diagnostic Page

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to**:
   ```
   http://localhost:3000/test-email
   ```

3. **Enter a registered email** (check Supabase → Authentication → Users)

4. **Click "Test Password Reset Email"**

5. **Check the result**:
   - ✅ Green = Success! Check email inbox
   - ❌ Red = See error details below

## Common Errors & Fixes

### Error: "Invalid redirect URL"

**Fix:**
```
1. Supabase Dashboard → Authentication → URL Configuration
2. Add to Redirect URLs: http://localhost:3000/**
3. Save
4. Try again
```

### Error: "Rate limit exceeded" or "Too many requests"

**Fix:**
```
1. Wait 10-15 minutes
2. Don't test more than 3-4 times per hour
3. OR set up custom SMTP (see below)
```

### Error: "User not found"

**Fix:**
```
1. Supabase Dashboard → Authentication → Users
2. Verify the email exists
3. If not, sign up first
4. Try reset again
```

### Error: "SMTP authentication failed"

**If you set up custom SMTP:**

**For Gmail:**
```
❌ Wrong: Using regular Gmail password
✅ Correct: Use App Password

How to get App Password:
1. Google Account → Security
2. Enable 2-Factor Authentication
3. Search "App Passwords"
4. Generate new password for "Mail"
5. Use this 16-character password in Supabase
```

**For SendGrid:**
```
Username: apikey (literally the word "apikey")
Password: SG.xxxxxxxxxxxxx (your actual API key)
Sender: verified@yourdomain.com (must be verified in SendGrid)
```

## Quick SMTP Setup (Recommended)

Built-in Supabase email has strict limits. Use custom SMTP:

### Option 1: Gmail (Free, Easy)

1. **Get App Password**:
   - Google Account → Security → 2FA → App Passwords
   - Generate for "Mail"
   - Copy 16-character password

2. **Configure in Supabase**:
   - Dashboard → Project Settings → Auth
   - Scroll to SMTP Settings
   - Enable custom SMTP:
   
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: yourname@gmail.com
   Password: [16-char app password]
   Sender email: yourname@gmail.com
   Sender name: DetectX
   ```

3. **Save** and test

### Option 2: Mailtrap (Free, For Testing)

1. **Sign up**: https://mailtrap.io
2. **Go to**: Email Testing → Inboxes → My Inbox
3. **Copy SMTP credentials**
4. **Configure in Supabase**:
   
   ```
   Host: sandbox.smtp.mailtrap.io
   Port: 587
   Username: [from mailtrap]
   Password: [from mailtrap]
   Sender email: test@detectx.com
   Sender name: DetectX
   ```

**Note**: Mailtrap doesn't actually send emails - it catches them for testing!

## Testing Checklist

Before testing, verify:

- [ ] Supabase Site URL = `http://localhost:3000`
- [ ] Redirect URL includes `http://localhost:3000/**`
- [ ] Email provider is enabled
- [ ] Test email exists in Users table
- [ ] Dev server is running on port 3000
- [ ] Not rate limited (wait if tested recently)

## How to Test

### Method 1: Use Test Page (Recommended)

```bash
npm run dev
```

Visit: http://localhost:3000/test-email

This page will:
- ✅ Show detailed error messages
- ✅ Log all API calls
- ✅ Display configuration
- ✅ Give specific fix suggestions

### Method 2: Use Login Page

```bash
npm run dev
```

1. Visit: http://localhost:3000/auth/login
2. Click "Forgot password?"
3. Enter registered email
4. Click "Send Reset Link"
5. **Check browser console (F12)** for logs

### Method 3: Check Supabase Logs

1. Supabase Dashboard → Logs → Auth Logs
2. Look for recent entries
3. Check for errors
4. Note: "event": "password_recovery"

## Expected Success Flow

When working correctly:

```
1. Enter email → Loading state appears
   ↓
2. API call to Supabase (check Network tab)
   ↓
3. Success message: "Check Your Email"
   ↓
4. Email arrives within 1-2 minutes
   ↓
5. Click link → Redirects to reset page
   ↓
6. Enter new password → Success!
```

## Still Not Working?

### Check Environment Variables

```bash
# Check .env.local file exists
ls -la .env.local

# Should contain:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**After changing .env.local:**
```bash
# MUST restart dev server
# Ctrl+C to stop
npm run dev
```

### Check Supabase Project Status

1. Is your project active?
2. Visit: https://status.supabase.com/
3. Check for service issues

### Verify Supabase Configuration

Run this in browser console on your site:

```javascript
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('Origin:', window.location.origin)
```

Should show:
```
URL: https://yourproject.supabase.co
Has Key: true
Origin: http://localhost:3000
```

## Debug Logs

The ForgotPasswordModal now includes detailed logging. Open browser console (F12) and you'll see:

```javascript
🔍 Attempting password reset for: user@example.com
🌐 Redirect URL: http://localhost:3000/auth/reset-password
📊 Reset password response: { data: {...}, error: null }
✅ Password reset email sent successfully
```

Or if error:
```javascript
❌ Supabase error: { message: "...", status: 400 }
```

## Quick Reference

### Most Common Fix (90% of cases):

```
1. Supabase Dashboard
2. Authentication → URL Configuration
3. Site URL: http://localhost:3000
4. Redirect URLs: http://localhost:3000/**
5. Save
6. Test again
```

### Second Most Common Fix:

```
1. Wait 10-15 minutes (rate limit)
2. OR set up custom SMTP
```

### Third Most Common Fix:

```
1. Use Gmail SMTP with App Password
2. See "Quick SMTP Setup" above
```

## Get Help

If still stuck:

1. **Use test page**: http://localhost:3000/test-email
2. **Check browser console** (F12 → Console)
3. **Check Supabase logs** (Dashboard → Logs → Auth)
4. **See detailed guide**: `/docs/EMAIL_TROUBLESHOOTING.md`

## Summary

The fix is usually one of these:

✅ **Site URL not set** → Set to `http://localhost:3000`  
✅ **Redirect URL not allowed** → Add `http://localhost:3000/**`  
✅ **Rate limited** → Wait 15 minutes or use custom SMTP  
✅ **SMTP wrong** → Use App Password for Gmail  
✅ **Email doesn't exist** → Check Users table  

**Most likely**: You just need to set the Site URL! 🎯
