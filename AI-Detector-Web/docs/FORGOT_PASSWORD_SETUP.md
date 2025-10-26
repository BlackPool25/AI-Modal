# Forgot Password Feature - Complete Setup Guide

This guide explains the forgot password functionality implementation using Supabase.

## Overview

The forgot password feature allows users to reset their password through email verification. It consists of:

1. **Forgot Password Modal** - Users enter their email to request a password reset
2. **Email Confirmation** - Supabase sends a password reset email
3. **Reset Password Page** - Users create a new password after clicking the email link

## Files Involved

- `/app/auth/login/page.tsx` - Login page with "Forgot password?" link
- `/components/auth/ForgotPasswordModal.tsx` - Modal for requesting password reset
- `/app/auth/reset-password/page.tsx` - Page for setting new password

## How It Works

### 1. Request Password Reset

When a user clicks "Forgot password?" on the login page:

```typescript
// In ForgotPasswordModal.tsx
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,
})
```

This triggers Supabase to:
- Verify the email exists in the database
- Send a password reset email with a secure token
- Include the redirect URL for after clicking the link

### 2. Email Confirmation

Supabase automatically sends an email to the user with:
- A secure, time-limited reset link
- The link includes a recovery token
- Token expires after a set time (default: 1 hour)

### 3. Reset Password

When users click the email link:
- They're redirected to `/auth/reset-password`
- The page validates the recovery token
- Users enter their new password
- Password is updated via Supabase Auth

```typescript
// In reset-password/page.tsx
const { error } = await supabase.auth.updateUser({
  password: password
})
```

## Supabase Configuration

### Required Email Template Setup

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Email Templates**
3. Find the **Reset Password** template
4. Ensure it's configured correctly (default template works well)

### Email Template Variables

The email template supports these variables:
- `{{ .Token }}` - The recovery token
- `{{ .TokenHash }}` - Hash version of the token
- `{{ .SiteURL }}` - Your site URL from Supabase settings
- `{{ .ConfirmationURL }}` - Full confirmation URL with token

### Site URL Configuration

**IMPORTANT:** Configure your Site URL in Supabase:

1. Go to **Authentication** > **URL Configuration**
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/reset-password`
   - `https://your-domain.com/auth/reset-password`

### Email Provider Setup

For production, you may want to configure a custom SMTP provider:

1. Go to **Project Settings** > **Auth**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, AWS SES, etc.)

**Development:** Supabase provides a built-in email service for testing.

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## User Flow

### Happy Path

1. User clicks "Forgot password?" on login page
2. Modal opens, user enters their email
3. User clicks "Send Reset Link"
4. Success message displayed: "Check Your Email"
5. User receives email from Supabase
6. User clicks link in email
7. Redirected to `/auth/reset-password`
8. User enters new password (twice for confirmation)
9. Password updated successfully
10. Redirected to login page
11. User logs in with new password

### Error Handling

**Invalid Email:**
```typescript
// If email doesn't exist in database
// Supabase still returns success (for security)
// User sees success message but no email is sent
```

**Expired Token:**
```typescript
// If user waits too long to use the link
// Reset password page shows: "Invalid or expired reset link"
```

**Password Requirements:**
- Minimum 6 characters (configurable in Supabase)
- Passwords must match
- Validated on client and server

## Security Features

### Rate Limiting

Supabase provides built-in rate limiting for password reset requests:
- Prevents spam/abuse
- Limits requests per IP address
- Configurable in Supabase dashboard

### Token Security

- Recovery tokens are single-use
- Tokens expire after 1 hour (default)
- Tokens are cryptographically secure
- Cannot be reused after password reset

### RLS Policies

Row Level Security ensures users can only access their own data:

```sql
-- Users can only update their own password
-- This is handled by Supabase Auth automatically
```

## Testing

### Test Forgot Password Flow

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Test the Flow:**
   - Navigate to `http://localhost:3000/auth/login`
   - Click "Forgot password?"
   - Enter a registered email address
   - Check the email inbox (or Supabase logs)
   - Click the reset link
   - Enter new password
   - Verify login with new password

3. **Check Email in Development:**
   
   If using Supabase's built-in email (development):
   - Go to Supabase Dashboard
   - Navigate to **Authentication** > **Users**
   - Find your test user
   - Check recent activity/emails in logs

## Customization

### Email Template Customization

Edit the email template in Supabase Dashboard:

```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password for DetectX:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

### Redirect URL Customization

Change the redirect URL in `ForgotPasswordModal.tsx`:

```typescript
redirectTo: `${window.location.origin}/auth/custom-reset-page`,
```

### Token Expiry

Configure in Supabase Dashboard:
1. Go to **Authentication** > **Policies**
2. Adjust **JWT expiry** settings
3. Adjust **Recovery token expiry**

## Troubleshooting

### Email Not Received

1. **Check Spam Folder**
2. **Verify Email Provider:**
   - Go to Supabase Dashboard > Project Settings > Auth
   - Check SMTP settings or use built-in email
3. **Check Supabase Logs:**
   - Go to Logs > Auth
   - Look for email delivery errors

### Invalid Redirect URL

**Error:** "Invalid redirect URL"

**Solution:**
1. Go to Supabase Dashboard
2. **Authentication** > **URL Configuration**
3. Add your redirect URL to allowed list

### Token Expired

**Error:** "Invalid or expired reset link"

**Solutions:**
- Request a new password reset
- Increase token expiry in Supabase settings

### Production Issues

1. **Verify Environment Variables:**
   ```bash
   # In Vercel/Production
   NEXT_PUBLIC_SUPABASE_URL=your-production-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
   ```

2. **Update Site URL:**
   - Must match your production domain
   - Include https:// for security

3. **Configure Custom SMTP:**
   - Required for high-volume production use
   - More reliable than built-in email

## API Reference

### Supabase Auth Methods Used

```typescript
// Request password reset
supabase.auth.resetPasswordForEmail(email, options)

// Update password (after clicking email link)
supabase.auth.updateUser({ password: newPassword })

// Get current session
supabase.auth.getSession()

// Listen for auth state changes
supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    // Handle password recovery flow
  }
})
```

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Password Reset API Reference](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)

## Support

If you encounter issues:

1. Check Supabase Dashboard logs
2. Verify environment variables
3. Test with a different email address
4. Review the error messages in browser console
5. Check network tab for API responses

## Summary

The forgot password feature is now fully implemented with:

✅ "Forgot password?" link on login page  
✅ Modal for email entry  
✅ Supabase email confirmation  
✅ Secure password reset page  
✅ Email validation and error handling  
✅ Success/error states with user feedback  
✅ Automatic redirect after success  
✅ Mobile-responsive design  

Users can now safely recover their accounts through email verification!
