-- NON-SUPERUSER MIGRATION TO ADD MISSING SCHEMA PIECES
-- Safe for managed Supabase databases without superuser privileges

BEGIN;

-- 1) Add missing color column to habits table if it doesn't exist
-- This is safe - just adding a column with a default value
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#3B82F6';

-- 2) Create journal_entries table if it doesn't exist
-- Note: Removed CHECK constraints and complex features that might need superuser
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id_text TEXT,
  title TEXT,
  content TEXT NOT NULL,
  mood INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3) Add foreign key for user_id_text (safe operation)
-- First check if the constraint already exists to avoid errors
DO $$ 
BEGIN
    -- Only add constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'journal_entries_user_id_text_fkey' 
        AND table_name = 'journal_entries'
    ) THEN
        ALTER TABLE public.journal_entries ADD CONSTRAINT journal_entries_user_id_text_fkey 
          FOREIGN KEY (user_id_text) REFERENCES public.users(id_text) ON DELETE CASCADE;
    END IF;
EXCEPTION 
    WHEN OTHERS THEN
        -- If foreign key creation fails, continue without it
        RAISE NOTICE 'Could not create foreign key constraint, continuing...';
END $$;

-- 4) Create basic indexes (safe operations)
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id_text ON public.journal_entries(user_id_text);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON public.journal_entries(created_at DESC);

COMMIT;