-- Migration 032: Fix Supabase Security Advisor warnings
-- Run in Supabase SQL Editor.

-- ── 1. Drop orphan functions from another project ─────────────────────────────
-- These functions (create_doctor_profile, update_doctor_email, delete_my_account
-- as an RPC) do not appear in any migration file and are not called by the app.
-- They are publicly executable SECURITY DEFINER functions — high risk.
DROP FUNCTION IF EXISTS public.create_doctor_profile();
DROP FUNCTION IF EXISTS public.update_doctor_email(text);
DROP FUNCTION IF EXISTS public.delete_my_account();


-- ── 2. Fix business_stats view: enforce SECURITY INVOKER ─────────────────────
-- Supabase treats views created by the postgres role as SECURITY DEFINER by
-- default. Recreating with security_invoker = true makes it use the caller's
-- permissions, consistent with the RLS policies on the underlying tables.
CREATE OR REPLACE VIEW public.business_stats
WITH (security_invoker = true)
AS
SELECT
  b.id   AS business_id,
  b.user_id,
  COUNT(rr.id) AS total_requests,
  COUNT(CASE WHEN rr.status IN ('positive', 'awaiting_screenshot', 'rewarded') THEN 1 END) AS positive_count,
  COUNT(CASE WHEN rr.status = 'negative'    THEN 1 END) AS negative_count,
  COUNT(CASE WHEN rr.status = 'neutral'     THEN 1 END) AS neutral_count,
  COUNT(CASE WHEN rr.status = 'pending'     THEN 1 END) AS pending_count,
  COUNT(CASE WHEN rr.status = 'no_response' THEN 1 END) AS no_response_count,
  ROUND(
    CASE
      WHEN COUNT(CASE WHEN rr.status IN ('positive','negative','neutral','awaiting_screenshot','rewarded') THEN 1 END) > 0
      THEN COUNT(CASE WHEN rr.status IN ('positive', 'awaiting_screenshot', 'rewarded') THEN 1 END)::NUMERIC * 100
           / COUNT(CASE WHEN rr.status IN ('positive','negative','neutral','awaiting_screenshot','rewarded') THEN 1 END)
      ELSE 0
    END, 1
  ) AS positive_rate
FROM businesses b
LEFT JOIN review_requests rr ON rr.business_id = b.id
GROUP BY b.id, b.user_id;


-- ── 3. Revoke public/anon execute on RPC functions ────────────────────────────
-- check_business_rate_limit: only authenticated users (via their session)
REVOKE EXECUTE ON FUNCTION public.check_business_rate_limit(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_business_rate_limit(UUID) FROM anon;
-- Re-confirm the correct grant
GRANT EXECUTE ON FUNCTION public.check_business_rate_limit(UUID) TO authenticated;

-- assign_pool_discount_code: only service_role (called from Twilio webhook server)
REVOKE EXECUTE ON FUNCTION public.assign_pool_discount_code(UUID, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.assign_pool_discount_code(UUID, UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION public.assign_pool_discount_code(UUID, UUID) FROM authenticated;
-- Re-confirm the correct grant
GRANT EXECUTE ON FUNCTION public.assign_pool_discount_code(UUID, UUID) TO service_role;


-- ── 4. Fix mutable search_path on all app functions ───────────────────────────
-- Without a fixed search_path, a malicious user could create objects in a
-- schema that shadows pg_catalog or public, hijacking function calls.
ALTER FUNCTION public.check_business_rate_limit(UUID)
  SET search_path = public, pg_catalog;

ALTER FUNCTION public.assign_pool_discount_code(UUID, UUID)
  SET search_path = public, pg_catalog;

-- trim_old_reports may exist from cron setup — fix it if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'trim_old_reports') THEN
    EXECUTE 'ALTER FUNCTION public.trim_old_reports() SET search_path = public, pg_catalog';
  END IF;
END;
$$;

-- cleanup_rate_limit_events (from migration_017) — fix if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
             WHERE n.nspname = 'public' AND p.proname = 'cleanup_rate_limit_events') THEN
    EXECUTE 'ALTER FUNCTION public.cleanup_rate_limit_events() SET search_path = public, pg_catalog';
  END IF;
END;
$$;


-- ── 5. Fix rate_limit_events: RLS enabled but no policies ────────────────────
-- The table is accessed exclusively via service_role (which bypasses RLS).
-- Adding an explicit deny-all policy removes the linter warning while keeping
-- the intended behavior: no authenticated/anon user can read or write rows.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'rate_limit_events'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "no_direct_access" ON public.rate_limit_events
        USING (false)
        WITH CHECK (false)
    $policy$;
  END IF;
END;
$$;


-- ── 6. Restrict storage.logos listing ────────────────────────────────────────
-- The broad SELECT policy allows any anonymous user to list all logos in the
-- bucket. Replace with a folder-scoped policy: each user's logos live under
-- their user_id folder (e.g. "abc123/logo.png"), so only the owner can list.
-- Direct public URLs still work because the bucket is marked public = true —
-- that path bypasses RLS entirely.
DROP POLICY IF EXISTS "logos_public_read" ON storage.objects;

CREATE POLICY "logos_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
