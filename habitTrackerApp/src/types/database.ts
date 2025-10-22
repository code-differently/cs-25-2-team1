// Database entity types matching the actual schema from database/schema.sql

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes: string | null;
  created_at: string;
}

// Analytics view type from habit_stats
export interface HabitStats {
  habit_id: string;
  title: string;
  user_id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  color: string;
  is_active: boolean;
  total_completions: number;
  last_completed_at: string | null;
  unique_completion_days: number;
  last_7_days: number;
  last_30_days: number;
  today_count: number;
}

// Enhanced habit with computed stats
export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  lastCompleted: string | null;
}