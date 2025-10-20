// Authentication and session management types

import { User } from './database';

// ===============================================
// SESSION TYPES
// ===============================================

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp
}

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  iat: number; // issued at
  exp: number; // expires at
  aud: string; // audience
  iss: string; // issuer
}

// ===============================================
// AUTH CONTEXT TYPES
// ===============================================

export interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// ===============================================
// AUTH MIDDLEWARE TYPES
// ===============================================

export interface AuthenticatedRequest extends Request {
  user: User;
  session: UserSession;
}

export interface MiddlewareConfig {
  requireAuth?: boolean;
  allowedRoles?: string[];
  rateLimiting?: {
    windowMs: number;
    maxRequests: number;
  };
}

// ===============================================
// SUPABASE AUTH TYPES
// ===============================================

export interface SupabaseAuthUser {
  id: string;
  email: string;
  user_metadata: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseAuthUser;
}

// ===============================================
// AUTH ERROR TYPES
// ===============================================

export interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED' | 'SESSION_EXPIRED';
  message: string;
}

// ===============================================
// PASSWORD RESET TYPES
// ===============================================

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  token: string;
  newPassword: string;
}

// ===============================================
// PROFILE UPDATE TYPES
// ===============================================

export interface ProfileUpdateRequest {
  full_name?: string;
  avatar_url?: string;
}

// ===============================================
// TYPE GUARDS
// ===============================================

export function isAuthError(error: any): error is AuthError {
  return error && typeof error.code === 'string' && 
         ['INVALID_CREDENTIALS', 'USER_EXISTS', 'TOKEN_EXPIRED', 'UNAUTHORIZED', 'SESSION_EXPIRED'].includes(error.code);
}

export function isValidSession(session: any): session is UserSession {
  return session && 
         session.user && 
         typeof session.accessToken === 'string' && 
         typeof session.refreshToken === 'string' && 
         typeof session.expiresAt === 'number';
}