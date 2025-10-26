# Username Signup Fix - Email Confirmation Issue

## Problem

Users were being asked to create a username again after signing up and confirming their email, even though they had already provided a username during registration.

## Root Cause

When email confirmation is enabled in Supabase:

1. User signs up with email, password, and username
2. `supabase.auth.signUp()` creates the user but **does NOT create a session** until email is confirmed
3. Code tried to insert into `user_profiles` table immediately
4. **Row Level Security (RLS)** policies block the insert because user is not authenticated (no session yet)
5. Profile creation fails silently
6. User confirms email → logs in → no profile exists → prompted to create username again

## Solution

### 1. Store Username in User Metadata

During signup, save the username in the user's metadata:

```typescript
await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      username: username.trim(), // ← Stored in metadata
    }
  }
})
```

### 2. Create Profile After Email Confirmation

In the auth callback route, after email confirmation:

```typescript
const { data, error } = await supabase.auth.exchangeCodeForSession(code)

if (data.user) {
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', data.user.id)
    .single()

  // Create profile from metadata if it doesn't exist
  if (!existingProfile && data.user.user_metadata?.username) {
    await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        username: data.user.user_metadata.username,
        bio: null,
        avatar_url: null,
      })
  }
}
```

## Why This Works

1. **User metadata** is stored by Supabase during signup (before confirmation)
2. After email confirmation, user **has a valid session** (authenticated)
3. With a session, **RLS policies allow** the profile insert
4. Profile is created successfully with the username from metadata
5. User proceeds to dashboard with their profile ready

## Files Changed

### `/app/auth/signup/page.tsx`
- Added `data: { username }` to signup options
- Reorganized profile creation logic to handle both scenarios:
  - Immediate session (no email confirmation): Create profile immediately
  - Email confirmation required: Store in metadata, create later

### `/app/auth/callback/route.ts`
- Added profile creation logic after email confirmation
- Checks if profile exists before attempting to create
- Uses username from `user_metadata`
- Added error handling and logging

## Testing

### Test Case 1: Email Confirmation Enabled (Production)
1. Sign up with username, email, password
2. Receive confirmation email
3. Click confirmation link
4. Redirected to dashboard
5. ✅ Profile exists with chosen username
6. ✅ No prompt to create username again

### Test Case 2: Email Confirmation Disabled (Optional)
1. Sign up with username, email, password
2. Immediately logged in
3. Profile created right away
4. Redirected to dashboard
5. ✅ Profile exists with chosen username

## Fallback Behavior

The settings page still has a fallback for edge cases:

- If somehow a profile doesn't exist after authentication
- User will be prompted to create one
- This should only happen in exceptional circumstances:
  - Profile creation failed in callback
  - User was created before this fix
  - Database issues

This ensures users are never stuck without a profile.

## Benefits

1. ✅ **Better UX**: Username entered once during signup
2. ✅ **Works with email confirmation**: Properly handles async flow
3. ✅ **RLS compliant**: Creates profile when user is authenticated
4. ✅ **Fallback safe**: Settings page handles edge cases
5. ✅ **Production ready**: Works in both dev and production environments

## Migration Note

Existing users who signed up before this fix may still need to create a username when they first visit settings. This is expected and the fallback handles it gracefully.

New signups after this fix will have their profile created automatically after email confirmation.
