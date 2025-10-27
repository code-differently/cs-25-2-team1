import { NextRequest } from 'next/server';
import { GET, POST } from '../../../src/app/api/habits/route';

// Mock dependencies
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          range: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'new-habit-id' }],
          error: null,
        }),
      }),
    }),
  },
}));

jest.mock('zod', () => ({
  z: {
    object: jest.fn().mockReturnValue({
      parse: jest.fn(),
    }),
    string: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      regex: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
    }),
    enum: jest.fn().mockReturnValue({}),
    number: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
    }),
  },
}));

import { z } from 'zod';
import { supabase } from '../../src/lib/supabaseClient';

const mockSupabase = supabase as any;
const mockZodSchema = z.object as jest.Mock;

describe('Habits API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/habits', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habits');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost/api/habits', {
        headers: {
          authorization: 'InvalidToken',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when token is invalid', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new NextRequest('http://localhost/api/habits', {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('Invalid token');
    });

    it('should return habits for authenticated user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabits = [
        {
          id: 'habit-1',
          title: 'Exercise',
          description: 'Daily workout',
          frequency: 'daily',
          target_count: 1,
          color: '#ff0000',
          user_id: 'user-123',
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockHabits,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.habits).toEqual(mockHabits);
    });

    it('should handle query parameters correctly', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }),
          }),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/habits?include_stats=true&is_active=true&limit=10&offset=5', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      await GET(request);

      expect(mockSupabase.from).toHaveBeenCalledWith('habits');
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.select().eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should handle database errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('POST /api/habits', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Habit',
          frequency: 'daily',
          target_count: 1,
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create a new habit with valid data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabitData = {
        title: 'New Habit',
        description: 'Test habit',
        frequency: 'daily',
        target_count: 1,
        color: '#ff0000',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue(mockHabitData),
      });

      const mockInsertedHabit = {
        id: 'new-habit-id',
        ...mockHabitData,
        user_id: 'user-123',
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: [mockInsertedHabit],
            error: null,
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify(mockHabitData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.habit).toEqual(mockInsertedHabit);
    });

    it('should return 400 for invalid request data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockImplementation(() => {
          throw new z.ZodError([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['title'],
              message: 'Title is required',
            },
          ]);
        }),
      });

      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          frequency: 'daily',
          target_count: 1,
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation Error');
    });

    it('should handle database insert errors', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabitData = {
        title: 'New Habit',
        frequency: 'daily',
        target_count: 1,
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue(mockHabitData),
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Insert failed' },
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify(mockHabitData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });

    it('should handle JSON parse errors', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: 'invalid json',
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid JSON');
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors in GET', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habits', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });

    it('should handle unexpected errors in POST', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habits', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test',
          frequency: 'daily',
          target_count: 1,
        }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });
  });
});