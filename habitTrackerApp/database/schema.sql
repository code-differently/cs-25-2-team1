-- ===============================================
-- HABIT TRACKER DATABASE SCHEMA WITH RLS
-- ===============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- USERS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ===============================================
-- HABITS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(trim(title)) > 0),
  description TEXT,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily' NOT NULL,
  target_count INTEGER DEFAULT 1 CHECK (target_count > 0) NOT NULL,
  color TEXT DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own habits" ON public.habits;
CREATE POLICY "Users can view own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own habits" ON public.habits;
CREATE POLICY "Users can insert own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own habits" ON public.habits;
CREATE POLICY "Users can update own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own habits" ON public.habits;
CREATE POLICY "Users can delete own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================================
-- HABIT LOGS TABLE
-- ===============================================

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Prevent duplicate completions on same day for same habit
CREATE UNIQUE INDEX IF NOT EXISTS idx_habit_logs_unique_daily ON public.habit_logs(
  habit_id, 
  DATE(completed_at AT TIME ZONE 'UTC')
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own habit logs" ON public.habit_logs;
CREATE POLICY "Users can view own habit logs" ON public.habit_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own habit logs" ON public.habit_logs;
CREATE POLICY "Users can insert own habit logs" ON public.habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own habit logs" ON public.habit_logs;
CREATE POLICY "Users can update own habit logs" ON public.habit_logs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own habit logs" ON public.habit_logs;
CREATE POLICY "Users can delete own habit logs" ON public.habit_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ===============================================
-- INDEXES FOR PERFORMANCE
-- ===============================================

-- Habits indexes
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);

-- Habit logs indexes
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON public.habit_logs(completed_at DESC);

-- Composite index for common date range queries
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_completed ON public.habit_logs(
  user_id, 
  completed_at DESC
);

-- Composite index for habit-specific queries
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_completed ON public.habit_logs(
  habit_id, 
  completed_at DESC
);

-- ===============================================
-- FUNCTIONS AND TRIGGERS
-- ===============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Data integrity function for habit_logs
CREATE OR REPLACE FUNCTION public.validate_habit_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the habit belongs to the user
  IF NOT EXISTS (
    SELECT 1 FROM public.habits 
    WHERE id = NEW.habit_id AND user_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Habit does not belong to the specified user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_habits ON public.habits;
CREATE TRIGGER set_updated_at_habits
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for habit ownership validation
DROP TRIGGER IF EXISTS validate_habit_logs_ownership ON public.habit_logs;
CREATE TRIGGER validate_habit_logs_ownership
  BEFORE INSERT OR UPDATE ON public.habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_habit_ownership();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- HELPER FUNCTIONS
-- ===============================================

-- Get habit completion rate for date range
CREATE OR REPLACE FUNCTION public.get_habit_completion_rate(
  p_habit_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
  v_frequency TEXT;
  v_expected_completions INTEGER;
  v_actual_completions INTEGER;
BEGIN
  -- Get habit frequency
  SELECT frequency INTO v_frequency
  FROM public.habits
  WHERE id = p_habit_id;
  
  -- Calculate expected completions based on frequency (assuming target_count = 1)
  v_expected_completions := CASE v_frequency
    WHEN 'daily' THEN (p_end_date - p_start_date + 1)
    WHEN 'weekly' THEN CEIL((p_end_date - p_start_date + 1) / 7.0)
    WHEN 'monthly' THEN CEIL((p_end_date - p_start_date + 1) / 30.0)
  END;
  
  -- Count actual completions
  SELECT COUNT(*) INTO v_actual_completions
  FROM public.habit_logs
  WHERE habit_id = p_habit_id
    AND DATE(completed_at) BETWEEN p_start_date AND p_end_date;
  
  -- Return completion rate
  RETURN CASE 
    WHEN v_expected_completions = 0 THEN 0
    ELSE LEAST(v_actual_completions::DECIMAL / v_expected_completions * 100, 100)
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- GRANT PERMISSIONS
-- ===============================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;