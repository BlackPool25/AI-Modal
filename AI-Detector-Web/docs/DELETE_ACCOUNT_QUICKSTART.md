# Quick Setup: Delete Account Feature

## 1. Run This SQL in Supabase

1. Go to: https://app.supabase.com/project/cjkcwycnetdhumtqthuk/sql/new
2. Paste and run:

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

## 2. Deploy Your Code

```bash
git add .
git commit -m "Add delete account feature"
git push origin main
```

Vercel will auto-deploy.

## 3. Done! ✅

Users can now delete their accounts from Settings → Danger Zone.

---

## Testing

1. Go to your app → Settings
2. Scroll to bottom → "Danger Zone"
3. Click "Delete Account"
4. Enter password and type `delete-my-account`
5. Confirm deletion

Account and all data will be permanently deleted.
