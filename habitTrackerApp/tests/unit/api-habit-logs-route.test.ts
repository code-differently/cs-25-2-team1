import { NextRequest } from 'next/server';
import { GET, POST } from '../../src/app/api/habit-logs/route';

// Mock dependencies
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            range: jest.fn().mockResolvedValue({
              data: [],
              error: null,
              count: 0,
            }),
          }),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
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
      uuid: jest.fn().mockReturnThis(),
      datetime: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
    }),
    number: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
    }),
  },
}));

import { z } from 'zod';
import { supabase } from '../../src/lib/supabaseClient';

const mockSupabase = supabase as any;
const mockZodSchema = z.object as jest.Mock;

describe('Habit Logs API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/habit-logs', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habit-logs');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost/api/habit-logs', {
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

      const request = new NextRequest('http://localhost/api/habit-logs', {
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

    it('should return habit logs with default pagination', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockLogs = [
        {
          id: 'log-1',
          habit_id: 'habit-1',
          user_id: 'user-123',
          completed_at: '2024-01-01T10:00:00Z',
          habits: { title: 'Exercise', color: '#ff0000' },
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({
                data: mockLogs,
                error: null,
                count: 1,
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.logs).toEqual(mockLogs);
      expect(data.data.total).toBe(1);
      expect(data.data.hasMore).toBe(false);
    });

    it('should handle habit_id filter parameter', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                  data: [],
                  error: null,
                  count: 0,
                }),
              }),
            }),
          }),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/habit-logs?habit_id=habit-123', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      
      expect(mockQuery.select().eq().order().range().eq).toHaveBeenCalledWith('habit_id', 'habit-123');
    });

    it('should handle date range filters', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockReturnValue({
                gte: jest.fn().mockReturnValue({
                  lte: jest.fn().mockResolvedValue({
                    data: [],
                    error: null,
                    count: 0,
                  }),
                }),
              }),
            }),
          }),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/habit-logs?start_date=2024-01-01&end_date=2024-01-31', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      
      expect(mockQuery.select().eq().order().range().gte).toHaveBeenCalledWith('completed_at', '2024-01-01');
      expect(mockQuery.select().eq().order().range().gte().lte).toHaveBeenCalledWith('completed_at', '2024-01-31');
    });

    it('should handle custom limit and offset', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({
                data: [],
                error: null,
                count: 0,
              }),
            }),
          }),
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery);

      const request = new NextRequest('http://localhost/api/habit-logs?limit=10&offset=20', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      
      expect(mockQuery.select().eq().order().range).toHaveBeenCalledWith(20, 29);
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
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
                count: 0,
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST /api/habit-logs', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        body: JSON.stringify({ habit_id: 'habit-123' }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create habit log successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const logData = {
        habit_id: 'habit-123',
        completed_at: '2024-01-01T10:00:00Z',
        count: 1,
        notes: 'Good workout',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue(logData),
      });

      // Mock habit verification
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: { id: 'habit-123' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        })
        // Mock log creation
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'log-123', ...logData, user_id: 'user-123' },
                error: null,
              }),
            }),
          }),
        });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.habit_id).toBe('habit-123');
    });

    it('should return 404 when habit not found', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue({ habit_id: 'nonexistent' }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: { code: 'PGRST116' },
                }),
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ habit_id: 'nonexistent' }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not found');
    });

    it('should return 409 for duplicate log entries', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const logData = { habit_id: 'habit-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue(logData),
      });

      // Mock habit verification success
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: { id: 'habit-123' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        })
        // Mock duplicate error
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: '23505' }, // Duplicate key error
              }),
            }),
          }),
        });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Already logged');
    });

    it('should handle validation errors', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockImplementation(() => {
          const error = new Error('Invalid habit_id');
          error.name = 'ZodError';
          throw error;
        }),
      });

      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ habit_id: 'invalid' }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors in GET', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habit-logs', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle unexpected errors in POST', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habit-logs', {
        method: 'POST',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ habit_id: 'habit-123' }),
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });
});