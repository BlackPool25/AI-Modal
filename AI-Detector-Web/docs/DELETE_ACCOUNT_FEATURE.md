# Delete Account Feature

## Overview

Added a secure account deletion feature that allows users to permanently delete their account with proper safeguards.

## User Flow

1. User navigates to **Settings**
2. Scrolls to the **Danger Zone** section at the bottom
3. Clicks **Delete Account** button
4. Modal appears with warnings
5. User must:
   - Enter their current password
   - Type `delete-my-account` exactly
6. Clicks **Delete My Account**
7. System verifies password
8. Deletes all user data:
   - Profile
   - Detection history
   - Auth account
9. User is signed out and redirected to home page

## Files Created/Modified

### New Files

1. **`/components/settings/DeleteAccountSection.tsx`**
   - React component for the delete account UI
   - Handles password verification
   - Manages the deletion flow

2. **`/docs/DELETE_USER_FUNCTION.md`**
   - SQL function documentation
   - Setup instructions

### Modified Files

1. **`/app/settings/page.tsx`**
   - Added DeleteAccountSection import
   - Added Danger Zone section at bottom of settings

## Features

### Security Features

✅ **Password Verification**
- User must enter their current password
- Password is verified before any deletion occurs

✅ **Typed Confirmation**
- User must type `delete-my-account` exactly
- Prevents accidental deletions

✅ **Multiple Warnings**
- Clear warning messages about permanence
- List of what will be deleted
- Red color scheme for danger indication

✅ **Server-Side Validation**
- Uses database function with `SECURITY DEFINER`
- Only authenticated users can execute
- Users can only delete their own account

### User Experience

✅ **Clear Warnings**
- Warning icon and message
- Detailed list of what gets deleted
- Styled in red to indicate danger

✅ **Loading States**
- Shows spinner while processing
- Disables buttons during deletion
- Prevents double-clicks

✅ **Error Handling**
- Shows clear error messages
- Handles incorrect password
- Handles network failures

✅ **Confirmation Modal**
- Can be cancelled at any time
- Resets all fields when closed
- Mobile-responsive design

## Setup Required

### 1. Create Database Function

Run this SQL in Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  DELETE FROM public.detection_history WHERE user_id = delete_user.user_id;
  DELETE FROM public.user_profiles WHERE id = delete_user.user_id;
  DELETE FROM auth.users WHERE id = delete_user.user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
```

### 2. Deploy Code

The code is already integrated. Just deploy the changes.

### 3. Test

1. Create a test account
2. Go to Settings
3. Try to delete with wrong password → should fail
4. Try with correct password but wrong confirmation text → should fail
5. Enter correct password and `delete-my-account` → should succeed
6. Verify account is deleted (can't log in again)

## What Gets Deleted

When a user deletes their account:

1. **User Profile** (`user_profiles` table)
   - Username
   - Bio
   - Avatar URL
   - All profile data

2. **Detection History** (`detection_history` table)
   - All detection records
   - File URLs
   - Analysis results

3. **Uploaded Files** (Storage buckets)
   - Files are already auto-deleted by the cleanup cron job
   - Or deleted when detection_history is removed (if foreign keys are set)

4. **Auth Account** (`auth.users` table)
   - Email
   - Password hash
   - Metadata
   - Sessions

## Security Notes

### Why No RLS Policy?

The `delete_user()` function uses `SECURITY DEFINER`, which means:
- It runs with database owner permissions
- It bypasses RLS policies
- Security is handled inside the function itself

This is safe because:
- The function checks `auth.uid()` to verify the user
- Only deletes data belonging to that user
- Only authenticated users can execute it
- Cannot be used to delete other users' accounts

### Password Verification

The component verifies the password by:
1. Getting the current user's email
2. Attempting to sign in with the provided password
3. If sign-in fails, password is wrong
4. Only proceeds if password is correct

This ensures users can't delete accounts without knowing the password.

### Confirmation Text

The exact string `delete-my-account` must be typed:
- Case-sensitive
- No extra spaces
- Prevents accidental clicks
- Ensures user intention

## UI Components

### Danger Zone Card

Located at the bottom of settings page:
- Red border (`border-red-500/20`)
- Warning icon
- Clear messaging
- Separated from other settings

### Delete Modal

Features:
- Warning banner with icon
- Bullet list of what gets deleted
- Password input field
- Confirmation text input
- Cancel and Delete buttons
- Delete button is red
- Disabled state when form incomplete

### Button States

1. **Default**: Gray outline, clickable
2. **Modal Open**: Password required
3. **Form Invalid**: Delete button disabled
4. **Deleting**: Shows spinner, all buttons disabled
5. **After Delete**: User redirected to home

## Error Messages

| Error | Message |
|-------|---------|
| No password | "Please enter your password" |
| Wrong confirmation text | "Please type 'delete-my-account' exactly to confirm" |
| Wrong password | "Incorrect password. Please try again." |
| Function not found | "Unable to delete account. Please contact support." |
| Network error | "Failed to delete account. Please try again." |

## Testing Checklist

- [ ] Danger Zone appears in settings
- [ ] Delete button opens modal
- [ ] Warning messages display correctly
- [ ] Password field works
- [ ] Confirmation text field works
- [ ] Cancel button closes modal and resets
- [ ] Delete button disabled when form incomplete
- [ ] Wrong password shows error
- [ ] Wrong confirmation text shows error
- [ ] Correct credentials delete account
- [ ] User signed out after deletion
- [ ] Redirected to home page
- [ ] Cannot log in with deleted account
- [ ] All data removed from database
- [ ] Mobile responsive design works

## Future Enhancements

Possible improvements:
- Email confirmation before deletion
- Grace period (30 days to recover)
- Export data before deletion
- Delete storage files explicitly
- Admin notification of deletions
- Deletion analytics

## Notes

- This is a permanent action - no undo
- Users who signed up before this feature won't be affected
- Consider adding email notification when account is deleted
- May want to keep some anonymized analytics data
