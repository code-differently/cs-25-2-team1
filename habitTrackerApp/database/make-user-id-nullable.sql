-- SAFE NON-SUPERUSER FIX: Make old user_id columns nullable
-- This allows us to use the new user_id_text columns without errors

BEGIN;

-- Make the old user_id columns nullable (safe for non-superuser)
-- These operations should work in managed Supabase
DO $$ 
BEGIN
    ALTER TABLE public.habits ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not make habits.user_id nullable: %', SQLERRM;
END $$;

DO $$ 
BEGIN
    ALTER TABLE "public"."habitProgress" ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not make habitProgress.user_id nullable: %', SQLERRM;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.habit_logs ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not make habit_logs.user_id nullable: %', SQLERRM;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.user_google_tokens ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not make user_google_tokens.user_id nullable: %', SQLERRM;
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.habit_calendar_events ALTER COLUMN user_id DROP NOT NULL;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not make habit_calendar_events.user_id nullable: %', SQLERRM;
END $$;

COMMIT;