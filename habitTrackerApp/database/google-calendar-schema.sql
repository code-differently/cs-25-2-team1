-- Add Google Calendar integration tables to your Supabase database

-- Table to store user's Google OAuth tokens
CREATE TABLE IF NOT EXISTS public.user_google_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to link habits with Google Calendar events
CREATE TABLE IF NOT EXISTS public.habit_calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  google_event_id TEXT NOT NULL,
  event_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, google_event_id)
);

-- Enable RLS on new tables
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_google_tokens
CREATE POLICY "Users can view own Google tokens" ON public.user_google_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own Google tokens" ON public.user_google_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own Google tokens" ON public.user_google_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own Google tokens" ON public.user_google_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for habit_calendar_events
CREATE POLICY "Users can view own calendar events" ON public.habit_calendar_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar events" ON public.habit_calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events" ON public.habit_calendar_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events" ON public.habit_calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_google_tokens_user_id ON public.user_google_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_calendar_events_user_id ON public.habit_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_calendar_events_habit_id ON public.habit_calendar_events(habit_id);

-- Grant permissions
GRANT ALL ON public.user_google_tokens TO authenticated;
GRANT ALL ON public.habit_calendar_events TO authenticated;