// API request and response types for all endpoints

import { Habit, HabitLog, HabitWithStats, User } from './database';

// ===============================================
// COMMON API TYPES
// ===============================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ===============================================
// AUTHENTICATION TYPES
// ===============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ===============================================
// HABIT TYPES
// ===============================================

export interface CreateHabitRequest {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  color?: string;
}

export interface UpdateHabitRequest {
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  target_count?: number;
  color?: string;
  is_active?: boolean;
}

export interface GetHabitsQuery {
  include_stats?: boolean;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

export interface HabitsResponse {
  habits: Habit[] | HabitWithStats[];
  total: number;
  hasMore: boolean;
}

// ===============================================
// HABIT LOG TYPES
// ===============================================

export interface CreateHabitLogRequest {
  habit_id: string;
  completed_at?: string; // ISO date string
  count?: number;
  notes?: string;
}

export interface GetHabitLogsQuery {
  habit_id?: string;
  start_date?: string; // ISO date string
  end_date?: string; // ISO date string
  limit?: number;
  offset?: number;
}

export interface HabitLogWithHabit extends HabitLog {
  habit: {
    title: string;
    color: string;
  };
}

export interface HabitLogsResponse {
  logs: HabitLogWithHabit[];
  total: number;
  hasMore: boolean;
}

// ===============================================
// ANALYTICS TYPES
// ===============================================

export interface DashboardAnalyticsQuery {
  period?: 'week' | 'month' | 'year';
}

export interface DashboardAnalytics {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  avgCompletionRate: number;
  currentStreaks: {
    habit_id: string;
    habit_name: string;
    streak: number;
  }[];
  recentActivity: {
    date: string;
    completions: number;
  }[];
}

export interface HabitAnalyticsQuery {
  period?: 'week' | 'month' | 'year';
}

export interface HabitAnalytics {
  habit_id: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  averagePerPeriod: number;
  completionHistory: {
    date: string;
    completed: boolean;
    count: number;
  }[];
}

// ===============================================
// INTEGRATION TYPES
// ===============================================

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface MotivationalQuote {
  quote: string;
  author: string;
  category: 'inspirational' | 'daily' | 'success' | 'motivation' | 'habit-motivation' | 'fallback';
  timestamp?: string;
  source?: 'zenquotes' | 'fallback';
}

export interface ZenQuotesResponse {
  success: boolean;
  data: MotivationalQuote | MotivationalQuote[];
  message?: string;
  cached?: boolean;
}

export interface ZenQuotesQuery {
  type?: 'random' | 'daily' | 'multiple' | 'habit-motivation';
  count?: number;
  habit_name?: string;
}

export interface NotificationRequest {
  user_id: string;
  title: string;
  message: string;
  scheduled_at?: string;
  habit_id?: string;
}

// ===============================================
// ERROR TYPES
// ===============================================

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ===============================================
// TYPE GUARDS
// ===============================================

export function isAPIError(error: any): error is APIError {
  return error && typeof error.code === 'string' && typeof error.message === 'string';
}

export function isValidationError(error: any): error is ValidationError {
  return error && typeof error.field === 'string' && typeof error.message === 'string';
}