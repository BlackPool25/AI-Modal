# Delete User Account Function

This SQL function allows authenticated users to delete their own account.

## SQL to Run in Supabase SQL Editor

```sql
-- Create a function to allow users to delete their own account
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();
  
  -- Check if user is authenticated
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete user's detection history (if not already deleted by CASCADE)
  DELETE FROM public.detection_history WHERE user_id = delete_user.user_id;
  
  -- Delete user's profile (if not already deleted by CASCADE)
  DELETE FROM public.user_profiles WHERE id = delete_user.user_id;
  
  -- Delete the auth user
  DELETE FROM auth.users WHERE id = delete_user.user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_user() IS 'Allows authenticated users to delete their own account and all associated data';
```

## How to Apply

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Paste the SQL above
5. Click **Run** or press `Ctrl+Enter`
6. ✅ That's it! No RLS policies needed.

## What This Does

- Allows authenticated users to delete their own account
- Automatically deletes:
  - User's detection history
  - User's profile
  - Auth user record
- Uses `SECURITY DEFINER` to allow the deletion even though users normally can't delete auth.users
- Only works for the authenticated user (can't delete other users)

## Security

- Function uses `auth.uid()` to ensure users can only delete their own account
- `SECURITY DEFINER` is safe here because it's restricted to the user's own data
- Granted only to `authenticated` role, not `anon`
- **No RLS policies needed** - The function bypasses RLS with `SECURITY DEFINER` and handles all security checks internally

## Testing

After applying, test that:
1. Users can successfully delete their own account
2. All associated data is removed
3. Users cannot delete other users' accounts
