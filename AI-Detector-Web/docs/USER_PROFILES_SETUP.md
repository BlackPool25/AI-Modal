# User Profiles & Settings Setup Guide

This guide covers the setup for user profiles, avatars, and the settings page.

## Overview

The user profile system includes:
- Username display (instead of email)
- Profile photos with auto-compression
- Bio/about section
- Password change with email confirmation
- Profile management settings page

## Prerequisites

- Supabase project already set up
- Authentication already working (from SUPABASE_SETUP.md)

## Step 1: Create user_profiles Table (5 minutes)

### In Supabase Dashboard → SQL Editor

Click "New Query" and run this SQL:

```sql
-- Create user_profiles table
create table public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Policy: Anyone can view profiles
create policy "Users can view all profiles"
  on public.user_profiles for select
  using (true);

-- Policy: Users can update own profile
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Policy: Users can insert own profile
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Create indexes for performance
create index user_profiles_username_idx on public.user_profiles(username);

-- Create function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();
```

✅ Verify: Check Table Editor → user_profiles exists

## Step 2: Create Avatars Storage Bucket (3 minutes)

### In Supabase Dashboard → Storage

1. Click **"New bucket"**
2. Fill in:
   - **Name:** `avatars`
   - **Public bucket:** ✓ Check this
3. Click **"Create bucket"**

## Step 3: Add Storage Policies for Avatars (3 minutes)

Click on `avatars` bucket → **Policies** → **New policy** → **For full customization**

### Policy 1: Upload (INSERT)

**Policy name:** `Authenticated users can upload avatars`

**Allowed operation:** ✓ INSERT

**Policy definition:**
```sql
auth.role() = 'authenticated' AND
bucket_id = 'avatars' AND
(storage.foldername(name))[1] = auth.uid()::text
```

### Policy 2: Read (SELECT)

**Policy name:** `Users can read avatars`

**Allowed operation:** ✓ SELECT

**Policy definition:**
```sql
bucket_id = 'avatars' AND
(storage.foldername(name))[1] = auth.uid()::text
```

### Policy 3: Delete (DELETE)

**Policy name:** `Users can delete own avatars`

**Allowed operation:** ✓ DELETE

**Policy definition:**
```sql
auth.role() = 'authenticated' AND
bucket_id = 'avatars' AND
(storage.foldername(name))[1] = auth.uid()::text
```

## Step 4: Test the Implementation (10 minutes)

### A. Test Signup with Username

1. Navigate to `/auth/signup`
2. You should now see:
   - Username field (new!)
   - Email field
   - Password fields
3. Try signing up with:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: (6+ characters)
4. ✅ Verify: User profile created in `user_profiles` table

### B. Test Navbar Display

1. After login, check the navbar
2. Should show:
   - ✅ Username (not email)
   - ✅ Default avatar icon
   - ✅ "Settings" option in dropdown menu

### C. Test Settings Page

1. Click on your profile → **Settings**
2. Test each section:

**Profile Photo:**
- Click "Change Photo"
- Upload an image (try a 5MB+ image)
- ✅ Verify: Image is compressed and uploaded
- ✅ Verify: Avatar shows in navbar immediately
- ✅ Check Storage → avatars bucket has your photo

**Profile Information:**
- Change username
- Add a bio
- Click "Save Changes"
- ✅ Verify: Changes saved successfully
- ✅ Verify: Username updates in navbar

**Password Change:**
- Enter new password and confirm
- Click "Update Password"
- ✅ Verify: Email confirmation sent
- ✅ Check your email inbox
- Click the confirmation link
- ✅ Verify: Password updated

## Features

### Auto-Compression

- Images automatically compressed to ~500KB
- Resized to 400x400px
- Converted to WebP format
- Original quality preserved where possible

### File Validation

- Max upload size: 5MB (before compression)
- Accepted formats: JPG, PNG, WebP, GIF
- MIME type validation
- Extension validation

### Username Rules

- Minimum 3 characters
- Letters, numbers, hyphens, underscores only
- Must be unique across all users
- Checked on signup before account creation

## File Structure

```
app/
  settings/
    page.tsx              # Main settings page
  auth/
    signup/
      page.tsx           # Updated with username field

components/
  settings/
    AvatarUpload.tsx     # Avatar upload component
    ProfileSection.tsx   # Profile editing
    PasswordSection.tsx  # Password change
  layout/
    Navbar.tsx          # Updated with avatar/username

hooks/
  useProfile.ts         # Profile management hook

lib/
  imageCompression.ts   # Image compression utility

types/
  profile.ts           # Profile interfaces
  database.ts          # Updated with user_profiles

public/
  default-avatar.svg   # Default avatar image
```

## Database Schema

### user_profiles Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Foreign key to auth.users |
| username | text (unique) | User's display name |
| bio | text (nullable) | User biography |
| avatar_url | text (nullable) | Profile photo URL |
| created_at | timestamptz | Account creation time |
| updated_at | timestamptz | Last profile update |

**Indexes:**
- `user_profiles_username_idx` on username (for fast lookups)

**Triggers:**
- `on_user_profiles_updated` - auto-updates `updated_at`

## Common Issues

### "Username already taken"
**Solution:** Choose a different username. Usernames must be unique.

### Avatar upload fails
**Solution:**
- Check avatars bucket exists
- Verify storage policies are created
- Ensure image is under 5MB
- Try a different image format

### Profile not showing in navbar
**Solution:**
- Logout and login again
- Clear browser cache
- Check user_profiles table has your record
- Verify RLS policies allow SELECT

### Password change email not received
**Solution:**
- Check spam folder
- Verify email in Supabase Auth settings
- Check Supabase logs for errors
- Ensure email provider is configured

## Password Change Flow

1. User enters new password (twice for confirmation)
2. Client validates:
   - Passwords match
   - Minimum 6 characters
3. Calls `supabase.auth.updateUser()`
4. Supabase sends confirmation email
5. User clicks link in email
6. Password updated on confirmation
7. User can login with new password

## Security Notes

### Row Level Security (RLS)

- ✅ All profiles visible (for potential future features like user search)
- ✅ Users can only update their own profile
- ✅ Users can only insert their own profile
- ✅ Avatar storage user-scoped

### Avatar Storage

- Files stored in: `avatars/{user_id}/avatar.webp`
- Each user can only access their own folder
- Public URLs but folder-based access control
- Automatic compression reduces storage costs

### Username Validation

- Client-side validation (pattern matching)
- Server-side uniqueness check
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)

## Future Enhancements

Potential features to add:

1. **Email Change** - Allow users to update email address
2. **Account Deletion** - Self-service account removal
3. **Privacy Settings** - Control profile visibility
4. **Two-Factor Auth** - Enhanced security
5. **Social Links** - Add Twitter, GitHub, etc.
6. **Profile Themes** - Custom color schemes
7. **Export Data** - GDPR compliance
8. **Activity Log** - View login history

## Troubleshooting

### Issue: "Profile not found" error

**Check:**
1. Is user_profiles table created?
2. Does user have a profile record?
3. Run this query in SQL Editor:
   ```sql
   select * from user_profiles where id = auth.uid();
   ```
4. If no result, create profile manually or re-signup

### Issue: Can't upload avatar

**Check:**
1. Avatars bucket exists
2. All 3 storage policies created
3. File is valid image format
4. File under 5MB
5. Browser console for errors

### Issue: Username doesn't update in navbar

**Solution:**
1. Refresh the page
2. Logout and login again  
3. Check browser console for errors
4. Verify profile was actually updated in database

## Migration for Existing Users

If you already have users without profiles:

### Option 1: Prompt on Login

Users will be prompted to create a username on first login after update.

### Option 2: Migration Script

Run this in Supabase SQL Editor:

```sql
-- Create profiles for users without one
insert into user_profiles (id, username, bio, avatar_url)
select 
  id,
  'user_' || substring(id::text from 1 for 8) as username,
  null,
  null
from auth.users
where id not in (select id from user_profiles);
```

This creates usernames like `user_a1b2c3d4` from user IDs.

Users can then change their username in settings.

## Support

If you encounter issues:

1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Verify all SQL ran successfully
4. Test with a fresh account
5. Review RLS policies

---

**Setup Complete!** 🎉

Users can now:
- ✅ Sign up with usernames
- ✅ Upload profile photos
- ✅ Edit their profile
- ✅ Change passwords
- ✅ See their info in the navbar

Next: Test all features and deploy to production!

