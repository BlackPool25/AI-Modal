# Delete Account Setup - Visual Guide

## Current Status: ❌ Not Working

Error: `Unable to delete account. Please contact support.`

**Why?** The database function hasn't been created yet.

---

## ✅ How to Fix (1 minute)

### Step 1: Open Supabase Dashboard

Go to: **https://app.supabase.com**

### Step 2: Select Your Project

Click on: **cjkcwycnetdhumtqthuk** (AI-Detector-Web)

### Step 3: Open SQL Editor

Left sidebar → **SQL Editor** → **New Query**

Or direct link: https://app.supabase.com/project/cjkcwycnetdhumtqthuk/sql/new

### Step 4: Paste This SQL

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

### Step 5: Run It

Click the **RUN** button (or press `Ctrl+Enter` / `Cmd+Enter`)

### Step 6: Confirm Success

You should see:

```
Success. No rows returned
```

---

## ✅ Done!

Now go to your app:
1. Settings → Danger Zone
2. Delete Account should work!

---

## What This Does

Creates a secure function that:
- ✅ Lets users delete their own account
- ✅ Removes all user data (profile, history, auth)
- ✅ Cannot be abused (only deletes own account)
- ✅ Runs with proper permissions

---

## Verification (Optional)

To verify it worked, run this in SQL Editor:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'delete_user';
```

Should return: `delete_user` ✅

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find SQL Editor | Left sidebar → SQL Editor → "+ New query" |
| SQL error | Make sure you copied the entire code block |
| Still getting error | Clear browser cache, try in incognito |
| Function not found | Re-run the SQL, check for typos |

---

## Need the SQL Again?

It's saved in these files:
- `/docs/DELETE_USER_FUNCTION.md`
- `/docs/DELETE_ACCOUNT_QUICKSTART.md`
- `/docs/FIX_DELETE_ACCOUNT_ERROR.md` (this file)
