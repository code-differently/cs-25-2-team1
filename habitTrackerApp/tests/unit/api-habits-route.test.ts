// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        range: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  }))
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabaseClient
}));

// Mock zod
jest.mock('zod', () => ({
  z: {
    object: jest.fn(() => ({
      parse: jest.fn()
    })),
    string: jest.fn(() => ({
      min: jest.fn(() => ({
        max: jest.fn(() => ({}))
      })),
      optional: jest.fn(() => ({})),
      regex: jest.fn(() => ({
        optional: jest.fn(() => ({}))
      }))
    })),
    enum: jest.fn(() => ({})),
    number: jest.fn(() => ({
      min: jest.fn(() => ({}))
    }))
  }
}));

import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';
import { GET, POST } from '../../src/app/api/habits/route';

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('/api/habits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/habits', () => {
    it('should return 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits');
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toBe('Unauthorized');
    });

    it('should return 401 when authorization header is invalid', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Invalid token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'GET', headers);
      
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
    });

    it('should return 401 when user is not found', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'GET', headers);
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });
      
      const response = await GET(request);
      
      expect(response.status).toBe(401);
      expect(response.data.message).toBe('Invalid token');
    });

    it('should return habits for authenticated user', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'GET', headers);
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabits = [
        { id: 'habit-1', title: 'Exercise', user_id: 'user-123' },
        { id: 'habit-2', title: 'Read', user_id: 'user-123' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const mockQuery = {
        range: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockHabits, error: null }))
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockQuery)
        }))
      } as any);
      
      const response = await GET(request);
      
      expect(response.status).toBe(200);
      expect(mockSupabase.from).toHaveBeenCalledWith('habits');
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    });

    it('should handle query parameters', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const url = 'http://localhost:3000/api/habits?include_stats=true&limit=10&offset=0';
      const request = new NextRequest(url, 'GET', headers);
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const mockQuery = {
        range: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => mockQuery)
        }))
      } as any);
      
      const response = await GET(request);
      
      expect(mockQuery.range).toHaveBeenCalledWith(0, 9); // offset to offset + limit - 1
    });

    it('should handle database errors', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'GET', headers);
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            range: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ 
                data: null, 
                error: { message: 'Database error' }
              }))
            }))
          }))
        }))
      } as any);
      
      const response = await GET(request);
      
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/habits', () => {
    it('should return 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/habits', 'POST');
      request.json = () => Promise.resolve({
        title: 'Test Habit',
        frequency: 'daily',
        target_count: 1
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(401);
      expect(response.data.success).toBe(false);
    });

    it('should create habit for authenticated user', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'POST', headers);
      
      const habitData = {
        title: 'Test Habit',
        description: 'Test Description',
        frequency: 'daily',
        target_count: 1,
        color: '#FF0000'
      };

      request.json = () => Promise.resolve(habitData);
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockCreatedHabit = { id: 'habit-1', ...habitData, user_id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({ 
            data: [mockCreatedHabit], 
            error: null 
          }))
        }))
      } as any);
      
      const response = await POST(request);
      
      expect(response.status).toBe(201);
      expect(mockSupabase.from).toHaveBeenCalledWith('habits');
    });

    it('should handle validation errors', async () => {
      const headers = new Headers();
      headers.set('authorization', 'Bearer valid-token');
      const request = new NextRequest('http://localhost:3000/api/habits', 'POST', headers);
      
      // Invalid data (missing required fields)
      request.json = () => Promise.resolve({
        title: '', // Empty title should fail validation
      });
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Mock zod validation error
      const { z } = require('zod');
      z.object().parse = jest.fn(() => {
        throw new Error('Validation failed');
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });
  });
});