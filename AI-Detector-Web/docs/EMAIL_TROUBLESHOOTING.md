# Supabase Email Troubleshooting Guide - "Error sending recovery email"

## Common Causes and Solutions

### Issue: "Error sending recovery email"

This error occurs when Supabase cannot send the password reset email. Here are the most common causes and solutions:

## 🔍 Step-by-Step Debugging

### 1. Check Site URL Configuration (MOST COMMON ISSUE)

**Problem:** Site URL not configured correctly in Supabase

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set **Site URL** to match your current environment:
   - Development: `http://localhost:3000`
   - Production: `https://your-actual-domain.com`

**Important:** The Site URL must match EXACTLY where your app is running.

### 2. Verify Redirect URLs

**Problem:** Redirect URL not in allowed list

**Solution:**
1. Go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add ALL of these:

```
http://localhost:3000/**
http://localhost:3000/auth/reset-password
http://localhost:3000/auth/callback
```

For production, also add:
```
https://your-domain.com/**
https://your-domain.com/auth/reset-password
https://your-domain.com/auth/callback
```

**Tip:** The `/**` wildcard allows all paths under that domain.

### 3. Check Email Confirmation Settings

**Problem:** Email confirmations disabled

**Solution:**
1. Go to **Authentication** → **Providers** → **Email**
2. Make sure **Enable Email Provider** is turned ON
3. Check **Email confirmation required**:
   - If OFF: Password reset should work for all users
   - If ON: Only verified users can reset password

### 4. Verify SMTP Settings (If Using Custom SMTP)

**Problem:** SMTP credentials incorrect or service blocked

**Check Your SMTP Settings:**

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Verify all settings are correct:

#### Gmail Issues:
- ❌ Don't use your regular password
- ✅ Use an App Password instead
- How to get Gmail App Password:
  1. Go to Google Account → Security
  2. Enable 2-Factor Authentication
  3. Go to App Passwords
  4. Generate password for "Mail"
  5. Use this password in SMTP settings

#### SendGrid Issues:
- Username must be: `apikey` (literally the word "apikey")
- Password must be your actual API key
- Sender email must be verified in SendGrid

#### AWS SES Issues:
- Must verify sender email in AWS SES Console
- Region in SMTP host must match your SES region
- Check AWS SES sending limits

### 5. Check Rate Limits

**Problem:** Too many emails sent too quickly

**Check:**
1. Supabase Dashboard → **Authentication** → **Rate Limits**
2. Built-in email service has strict limits
3. Default: 3-4 emails per hour per IP

**Solution:**
- Wait 10-15 minutes between attempts
- Use custom SMTP for higher limits
- Check Supabase logs for rate limit errors

### 6. Verify Email Address Exists

**Problem:** Email not registered in your app

**Check:**
1. Supabase Dashboard → **Authentication** → **Users**
2. Search for the email address
3. Verify user exists

**Important:** For security, Supabase may not show an error even if email doesn't exist, but it won't send the email.

### 7. Check Supabase Service Status

**Problem:** Supabase email service down

**Check:**
- Visit: https://status.supabase.com/
- Look for issues with "Email" or "Auth" services

## 🔧 Immediate Fixes

### Fix 1: Update Site URL (Do This First!)

```bash
# In Supabase Dashboard:
# Authentication → URL Configuration → Site URL
# Set to: http://localhost:3000
```

### Fix 2: Add Wildcard Redirect URL

```bash
# In Supabase Dashboard:
# Authentication → URL Configuration → Redirect URLs
# Add: http://localhost:3000/**
```

### Fix 3: Disable Email Confirmation Temporarily

```bash
# In Supabase Dashboard:
# Authentication → Providers → Email
# Turn OFF "Confirm email"
# (This allows password reset even if email not confirmed)
```

### Fix 4: Switch to Custom SMTP

The built-in email service has strict limits. For development, use a free SMTP service:

#### Option A: Gmail (Free)

1. **Get App Password:**
   - Google Account → Security → 2FA → App Passwords
   - Create password for "Mail"

2. **Configure in Supabase:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: [your-16-char-app-password]
   Sender: your-email@gmail.com
   Sender Name: DetectX
   ```

#### Option B: Mailtrap (Free for Testing)

1. **Sign up:** https://mailtrap.io
2. **Get credentials** from inbox settings
3. **Configure in Supabase:**
   ```
   Host: smtp.mailtrap.io
   Port: 587
   Username: [from mailtrap]
   Password: [from mailtrap]
   Sender: noreply@detectx.com
   Sender Name: DetectX
   ```

#### Option C: SendGrid (Free Tier - 100 emails/day)

1. **Sign up:** https://sendgrid.com
2. **Create API Key** (Settings → API Keys)
3. **Verify sender email** (Settings → Sender Authentication)
4. **Configure in Supabase:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [your-api-key]
   Sender: [your-verified-email]
   Sender Name: DetectX
   ```

## 🧪 Testing Steps

### Step 1: Test with Console Logging

Add detailed logging to see what's happening:

1. Open browser console (F12)
2. Try password reset
3. Check for errors in:
   - Browser Console
   - Network tab
   - Supabase Dashboard → Logs → Auth

### Step 2: Check Supabase Logs

1. Supabase Dashboard → **Logs** → **Auth Logs**
2. Look for entries with:
   - `"event": "password_recovery"`
   - Check for error messages
   - Look for "rate_limit" errors

Example log entry:
```json
{
  "event": "password_recovery",
  "email": "user@example.com",
  "error": "Error sending recovery email"
}
```

### Step 3: Test Email Provider Separately

**Test SMTP connection:**

1. Use an online SMTP tester
2. Or use this Node.js script:

```javascript
// test-smtp.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Ready!');
  }
});
```

## 📋 Configuration Checklist

Go through this checklist:

### Supabase Configuration:
- [ ] Site URL set to `http://localhost:3000`
- [ ] Redirect URL includes `http://localhost:3000/**`
- [ ] Email provider is enabled
- [ ] SMTP configured (if not using built-in)
- [ ] Test user exists in Users table
- [ ] Not rate limited (check logs)

### Environment Variables:
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Values match Supabase dashboard

### SMTP Provider (if used):
- [ ] Credentials are correct
- [ ] Sender email is verified
- [ ] Port is correct (587 for TLS)
- [ ] Not blocked by firewall

## 🐛 Common Error Messages

### "Error sending recovery email"
**Causes:**
- Site URL not configured
- Redirect URL not allowed
- Rate limit exceeded
- SMTP credentials wrong
- Email provider down

### "Invalid redirect URL"
**Causes:**
- Redirect URL not in allowed list
- Typo in URL
- Missing protocol (http:// or https://)

### "User not found"
**Causes:**
- Email not registered
- Typo in email address

### "Too many requests"
**Causes:**
- Rate limit hit
- Need custom SMTP
- Wait 10-15 minutes

## 🚀 Quick Fix Script

Create this file to test your setup:

```typescript
// test-password-reset.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
)

async function testPasswordReset() {
  console.log('Testing password reset...')
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    'test@example.com',
    {
      redirectTo: 'http://localhost:3000/auth/reset-password',
    }
  )
  
  if (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  } else {
    console.log('✅ Success! Check email.')
    console.log('Data:', data)
  }
}

testPasswordReset()
```

## 📞 Still Not Working?

### Check These Files:

1. **Supabase Client Setup**
   - File: `/lib/supabase/client.ts`
   - Verify correct URL and key

2. **Environment Variables**
   - Check `.env.local` exists
   - Restart dev server after changing

3. **Network Issues**
   - Check browser console for CORS errors
   - Verify Supabase project is active

### Get Help:

1. **Supabase Logs:** Dashboard → Logs → Auth
   - Look for detailed error messages
   
2. **Browser DevTools:** Network tab
   - Check API calls to Supabase
   - Look for 400/500 errors

3. **Supabase Support:**
   - Discord: https://discord.supabase.com
   - GitHub: https://github.com/supabase/supabase/discussions

## ✅ Expected Behavior

When working correctly:

1. User enters email
2. Modal shows "Sending..." state
3. Supabase API call succeeds (check Network tab)
4. Success message appears
5. Email arrives within 1-2 minutes
6. Check spam folder if not in inbox

## 🎯 Recommended Solution

**For immediate fix:**

1. **Set Site URL:** `http://localhost:3000`
2. **Add Redirect:** `http://localhost:3000/**`
3. **Use Gmail SMTP** with App Password
4. **Test with registered user**
5. **Check Supabase logs**

This should resolve 95% of email issues!
