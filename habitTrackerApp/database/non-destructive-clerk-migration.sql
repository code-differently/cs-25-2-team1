-- NON-DESTRUCTIVE MIGRATION FOR CLERK COMPATIBILITY
-- This approach avoids dropping dependent objects by creating new columns

BEGIN;

-- 0) Disable RLS on all tables (this should work with your permissions)
ALTER TABLE public.habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."habitProgress" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_google_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies (these should work)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert user profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can insert own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can update own habit logs" ON public.habit_logs;
DROP POLICY IF EXISTS "Users can delete own habit logs" ON public.habit_logs;

-- STEP 1: Add new TEXT columns alongside existing UUID columns

-- Add new id_text column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS id_text TEXT;

-- Add new user_id_text columns to referencing tables
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS user_id_text TEXT;
ALTER TABLE "public"."habitProgress" ADD COLUMN IF NOT EXISTS user_id_text TEXT;
ALTER TABLE public.habit_logs ADD COLUMN IF NOT EXISTS user_id_text TEXT;
ALTER TABLE public.user_google_tokens ADD COLUMN IF NOT EXISTS user_id_text TEXT;
ALTER TABLE public.habit_calendar_events ADD COLUMN IF NOT EXISTS user_id_text TEXT;

-- STEP 2: Populate the new TEXT columns with converted values

-- Convert existing UUID values to text
UPDATE public.users SET id_text = id::text WHERE id_text IS NULL;

-- Update referencing tables
UPDATE public.habits SET user_id_text = user_id::text WHERE user_id_text IS NULL;
UPDATE "public"."habitProgress" SET user_id_text = user_id::text WHERE user_id_text IS NULL;
UPDATE public.habit_logs SET user_id_text = user_id::text WHERE user_id_text IS NULL;
UPDATE public.user_google_tokens SET user_id_text = user_id::text WHERE user_id_text IS NULL;
UPDATE public.habit_calendar_events SET user_id_text = user_id::text WHERE user_id_text IS NULL;

-- STEP 3: Add constraints to new columns

-- Make id_text unique and not null
ALTER TABLE public.users ALTER COLUMN id_text SET NOT NULL;
ALTER TABLE public.users ADD CONSTRAINT users_id_text_unique UNIQUE (id_text);

-- Make user_id_text not null in referencing tables
ALTER TABLE public.habits ALTER COLUMN user_id_text SET NOT NULL;
ALTER TABLE "public"."habitProgress" ALTER COLUMN user_id_text SET NOT NULL;
ALTER TABLE public.habit_logs ALTER COLUMN user_id_text SET NOT NULL;
ALTER TABLE public.user_google_tokens ALTER COLUMN user_id_text SET NOT NULL;
ALTER TABLE public.habit_calendar_events ALTER COLUMN user_id_text SET NOT NULL;

-- STEP 4: Add foreign key constraints for new columns
ALTER TABLE public.habits ADD CONSTRAINT habits_user_id_text_fkey 
  FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;
ALTER TABLE "public"."habitProgress" ADD CONSTRAINT habitProgress_user_id_text_fkey 
  FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;
ALTER TABLE public.habit_logs ADD CONSTRAINT habit_logs_user_id_text_fkey 
  FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;
ALTER TABLE public.user_google_tokens ADD CONSTRAINT user_google_tokens_user_id_text_fkey 
  FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;
ALTER TABLE public.habit_calendar_events ADD CONSTRAINT habit_calendar_events_user_id_text_fkey 
  FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;

COMMIT;

-- INSTRUCTIONS:
-- 1. Run this migration first
-- 2. Update your application code to use the new *_text columns:
--    - users.id -> users.id_text  
--    - user_id -> user_id_text in all tables
-- 3. After testing, you can optionally drop the old UUID columns (but keep both for now)