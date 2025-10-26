# Supabase Email Configuration for Password Reset

## Quick Setup Checklist

Follow these steps to ensure password reset emails work correctly.

### 1. Configure Site URL (Required)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Set the **Site URL**:
   - **Development**: `http://localhost:3000`
   - **Production**: `https://your-domain.com`

### 2. Add Redirect URLs (Required)

In the same **URL Configuration** section, add these to **Redirect URLs**:

```
http://localhost:3000/auth/reset-password
http://localhost:3000/auth/callback
https://your-domain.com/auth/reset-password
https://your-domain.com/auth/callback
```

### 3. Verify Email Template (Optional)

1. Navigate to **Authentication** → **Email Templates**
2. Select **Reset Password**
3. Default template should look like this:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

**Variables available:**
- `{{ .Token }}` - The recovery token
- `{{ .TokenHash }}` - Hash version
- `{{ .SiteURL }}` - Your site URL
- `{{ .ConfirmationURL }}` - Full URL with token

### 4. Test Email Delivery

**Development (Built-in Email):**
- Supabase provides built-in email for testing
- Emails may go to spam - check spam folder
- View sent emails in: **Authentication** → **Logs**

**Production (Recommended: Custom SMTP):**

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable custom SMTP
4. Enter your provider details:

#### Example: Gmail SMTP
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: your-app-password (not regular password)
Sender email: your-email@gmail.com
Sender name: DetectX
```

#### Example: SendGrid
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: your-sendgrid-api-key
Sender email: noreply@your-domain.com
Sender name: DetectX
```

#### Example: AWS SES
```
Host: email-smtp.region.amazonaws.com
Port: 587
Username: your-smtp-username
Password: your-smtp-password
Sender email: noreply@your-domain.com
Sender name: DetectX
```

### 5. Configure Rate Limiting (Optional)

1. Go to **Authentication** → **Rate Limits**
2. Adjust settings for password reset:
   - **Email sends per hour**: 4 (prevents spam)
   - **Max attempts**: 3

### 6. Set Token Expiry (Optional)

1. Go to **Authentication** → **Policies**
2. Adjust **Recovery token expiry**:
   - Default: 3600 seconds (1 hour)
   - Recommended: Keep at 1 hour for security

## Testing the Flow

### Local Testing

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/auth/login`

3. Click "Forgot password?"

4. Enter a test email (must be registered)

5. Check email or Supabase logs:
   - Supabase Dashboard → **Authentication** → **Logs**
   - Look for "password recovery" events

6. Click the reset link in email

7. Should redirect to: `http://localhost:3000/auth/reset-password`

8. Enter new password and confirm

9. Verify you can login with new password

### Checking Logs

View email delivery status:
1. Supabase Dashboard → **Logs** → **Auth**
2. Filter by: `password_recovery`
3. Check for errors or successful sends

## Troubleshooting

### Email Not Received

**Check 1: Spam Folder**
- Built-in Supabase emails often go to spam

**Check 2: Email Exists**
- Email must be registered in your app
- Test with a known registered user

**Check 3: Supabase Logs**
```
1. Dashboard → Logs → Auth
2. Look for "resetPasswordForEmail" events
3. Check for error messages
```

**Check 4: Rate Limiting**
- Wait 5-10 minutes between attempts
- Don't spam the endpoint

### Invalid Redirect URL Error

**Solution:**
```
1. Dashboard → Authentication → URL Configuration
2. Verify your redirect URL is listed
3. Must include full path: /auth/reset-password
4. Must match exactly (http vs https, www vs non-www)
```

### Token Expired

**User sees:** "Invalid or expired reset link"

**Solutions:**
- Request a new reset email
- Check if token expiry is too short
- Ensure user clicks link within 1 hour

### SMTP Errors (Production)

**Common Issues:**

1. **Authentication Failed**
   - Verify SMTP username/password
   - Use app-specific password for Gmail
   - Check API key for SendGrid

2. **Connection Refused**
   - Verify SMTP host and port
   - Check firewall settings
   - Try TLS (port 587) vs SSL (port 465)

3. **Sender Email Rejected**
   - Verify sender email with provider
   - Use verified domain
   - Check SPF/DKIM records

## Environment Variables

Ensure these are set:

**.env.local (Development)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Vercel/Production**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## Production Checklist

Before deploying to production:

- [ ] Site URL set to production domain
- [ ] Redirect URLs include production domain
- [ ] Custom SMTP configured (recommended)
- [ ] Email template customized with branding
- [ ] Rate limiting configured
- [ ] Tested password reset flow
- [ ] Sender email verified with provider
- [ ] Environment variables set in hosting platform

## Security Best Practices

1. **Rate Limiting**: Prevent abuse with rate limits
2. **Token Expiry**: Keep at 1 hour or less
3. **HTTPS Only**: Production must use HTTPS
4. **Verified Domains**: Use verified sender domains
5. **Monitoring**: Watch auth logs for suspicious activity

## Customization Examples

### Custom Email Template

```html
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0;">DetectX</h1>
  </div>
  
  <div style="padding: 40px; background: white;">
    <h2>Reset Your Password</h2>
    <p>We received a request to reset your password. Click the button below to continue:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background: #667eea; color: white; padding: 15px 30px; 
                text-decoration: none; border-radius: 8px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      This link expires in 1 hour. If you didn't request this, please ignore this email.
    </p>
  </div>
  
  <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
    <p>© 2025 DetectX. All rights reserved.</p>
  </div>
</div>
```

### Custom Redirect After Reset

Modify `ForgotPasswordModal.tsx`:

```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password?from=login`,
})
```

Then check the query param in reset page:

```typescript
// In reset-password/page.tsx
const searchParams = useSearchParams()
const from = searchParams.get('from')

// After successful reset:
if (from === 'login') {
  router.push('/auth/login?reset=success')
}
```

## Need Help?

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Template Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

## Summary

✅ Forgot password feature is fully implemented  
✅ Supabase handles email delivery  
✅ Secure token-based password reset  
✅ Configurable email templates  
✅ Production-ready with custom SMTP  

Follow the checklist above to ensure everything is configured correctly!
