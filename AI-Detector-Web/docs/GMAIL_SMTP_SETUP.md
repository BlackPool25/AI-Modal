# 🚀 Quick Gmail SMTP Setup (5 Minutes)

## You Got Rate Limited! Here's the Fix

Your configuration is **correct** ✅ - you just need custom SMTP to avoid rate limits.

## Gmail SMTP Setup (Free & Easy)

### Step 1: Get Gmail App Password (2 minutes)

1. **Go to**: https://myaccount.google.com/security

2. **Enable 2-Factor Authentication** (if not already):
   - Click "2-Step Verification"
   - Follow the setup wizard
   - Verify your phone

3. **Create App Password**:
   - Search for "App passwords" in the security page
   - OR go directly to: https://myaccount.google.com/apppasswords
   
4. **Generate Password**:
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Name it: "Supabase DetectX"
   - Click **Generate**

5. **Copy the 16-character password**:
   ```
   Example: abcd efgh ijkl mnop
   ```
   ⚠️ **Save this password** - you won't see it again!

### Step 2: Configure Supabase SMTP (3 minutes)

1. **Open Supabase Dashboard**: https://supabase.com/dashboard

2. **Navigate to**: Project Settings → Auth

3. **Scroll down** to "SMTP Settings"

4. **Enable Custom SMTP** (toggle ON)

5. **Enter these settings**:

```
┌─────────────────────────────────────────┐
│ SMTP Configuration                      │
├─────────────────────────────────────────┤
│ Host                                    │
│ smtp.gmail.com                         │
│                                         │
│ Port Number                             │
│ 587                                    │
│                                         │
│ Username                                │
│ your-email@gmail.com                   │ ← Your Gmail address
│                                         │
│ Password                                │
│ abcdefghijklmnop                       │ ← The 16-char password
│                                         │ (remove spaces)
│ Sender email                            │
│ your-email@gmail.com                   │ ← Same as username
│                                         │
│ Sender name                             │
│ DetectX                                │ ← Your app name
└─────────────────────────────────────────┘
```

6. **Click Save**

### Step 3: Test It!

1. **Refresh your test page**: http://localhost:3000/test-email

2. **Enter a registered email**

3. **Click "Test Password Reset Email"**

4. **Should see**: ✅ Success!

5. **Check Gmail inbox** (or spam folder)

## Alternative: Use Mailtrap (For Testing Only)

If you don't want to use Gmail, try Mailtrap (catches emails, doesn't send them):

### Mailtrap Setup:

1. **Sign up**: https://mailtrap.io (free)

2. **Go to**: Email Testing → Inboxes → Demo inbox

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

5. **Test** - emails will appear in Mailtrap inbox (not real inbox)

## Alternative: Use SendGrid (Free 100 emails/day)

### SendGrid Setup:

1. **Sign up**: https://sendgrid.com (free tier)

2. **Verify sender email**:
   - Settings → Sender Authentication
   - Verify your email address

3. **Create API Key**:
   - Settings → API Keys
   - Create API Key
   - Copy the key (starts with `SG.`)

4. **Configure in Supabase**:
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey                    ← Literally the word "apikey"
Password: SG.xxxxxxxxxxxxxxxxxxxxx  ← Your actual API key
Sender email: your-verified@email.com
Sender name: DetectX
```

## Troubleshooting Gmail Setup

### "Authentication failed"
- ✅ Make sure you're using the **App Password**, not your regular Gmail password
- ✅ Remove spaces from the 16-character password
- ✅ Check 2-Factor Authentication is enabled

### "Username not accepted"
- ✅ Use your full Gmail address (including @gmail.com)
- ✅ Make sure Sender email matches Username

### Still not working?
- ✅ Try port 465 instead of 587
- ✅ Restart your browser after configuring
- ✅ Check Google Account security settings

## Quick Reference

### Gmail SMTP Settings:
```javascript
{
  host: "smtp.gmail.com",
  port: 587,
  username: "yourname@gmail.com",
  password: "abcdefghijklmnop", // 16-char App Password
  sender_email: "yourname@gmail.com",
  sender_name: "DetectX"
}
```

### Test Command:
```bash
# After configuring SMTP
npm run dev

# Visit:
http://localhost:3000/test-email
```

## Benefits of Custom SMTP

✅ **No rate limits** (or much higher limits)  
✅ **Faster delivery** (1-2 seconds vs 1-2 minutes)  
✅ **More reliable** for production  
✅ **Better deliverability** (fewer spam issues)  
✅ **Email tracking** (with SendGrid/Mailgun)  

## Your Current Status

✅ Supabase configured correctly  
✅ Site URL is set  
✅ Redirect URLs are working  
✅ Code is implemented  
⏳ **Just need SMTP to bypass rate limit**  

## Next Steps

1. **Choose provider**: Gmail (easiest) or SendGrid (best for production)
2. **Get credentials** (5 minutes)
3. **Configure in Supabase** (2 minutes)
4. **Test** at http://localhost:3000/test-email
5. **Done!** ✅

The forgot password feature will work perfectly once you set up SMTP!
