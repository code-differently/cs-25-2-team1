import { NextRequest } from 'next/server';
import { DELETE, GET, PUT } from '../../src/app/api/habits/[id]/route';

// Mock dependencies
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      }),
      delete: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
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
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      regex: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
    }),
    enum: jest.fn().mockReturnValue({
      optional: jest.fn().mockReturnThis(),
    }),
    number: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
    }),
    boolean: jest.fn().mockReturnValue({
      optional: jest.fn().mockReturnThis(),
    }),
  },
}));

import { z } from 'zod';
import { supabase } from '../../src/lib/supabaseClient';

const mockSupabase = supabase as any;
const mockZodSchema = z.object as jest.Mock;

describe('Habits [id] API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/habits/[id]', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habits/habit-123');
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when authorization header is malformed', async () => {
      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        headers: {
          authorization: 'InvalidToken',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
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

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('Invalid token');
    });

    it('should return 404 when habit is not found', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/nonexistent', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'nonexistent' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not Found');
    });

    it('should return habit when found', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabit = {
        id: 'habit-123',
        title: 'Exercise',
        description: 'Daily workout',
        frequency: 'daily',
        target_count: 1,
        color: '#ff0000',
        user_id: 'user-123',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockHabit,
                error: null,
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.habit).toEqual(mockHabit);
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
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('PUT /api/habits/[id]', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Habit' }),
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should update habit with valid data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const updateData = {
        title: 'Updated Exercise',
        description: 'Updated daily workout',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue(updateData),
      });

      const updatedHabit = {
        id: 'habit-123',
        ...updateData,
        user_id: 'user-123',
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [updatedHabit],
                error: null,
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'PUT',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.habit).toEqual(updatedHabit);
    });

    it('should return 404 when habit not found for update', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockReturnValue({ title: 'Updated' }),
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/nonexistent', {
        method: 'PUT',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title: 'Updated' }),
      });
      const params = Promise.resolve({ id: 'nonexistent' });
      
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Not Found');
    });

    it('should return 400 for invalid update data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockZodSchema.mockReturnValue({
        parse: jest.fn().mockImplementation(() => {
          const error = new Error('Validation failed');
          error.name = 'ZodError';
          throw error;
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'PUT',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title: 123 }),
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation Error');
    });
  });

  describe('DELETE /api/habits/[id]', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'DELETE',
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should delete habit successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: null,
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'DELETE',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Habit deleted successfully');
    });

    it('should handle delete errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Delete failed' },
            }),
          }),
        }),
      });

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'DELETE',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors in GET', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });

    it('should handle unexpected errors in PUT', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'PUT',
        headers: {
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title: 'Updated' }),
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });

    it('should handle unexpected errors in DELETE', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      const request = new NextRequest('http://localhost/api/habits/habit-123', {
        method: 'DELETE',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });
      const params = Promise.resolve({ id: 'habit-123' });
      
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal Server Error');
    });
  });
});