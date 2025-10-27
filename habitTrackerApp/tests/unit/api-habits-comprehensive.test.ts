/**
 * @jest-environment node
 */

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabaseClient
}));

// Mock zod validation
jest.mock('zod', () => ({
  z: {
    object: jest.fn(() => ({
      parse: jest.fn()
    })),
    string: jest.fn(() => ({
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
      regex: jest.fn(() => ({
        optional: jest.fn().mockReturnThis()
      }))
    })),
    enum: jest.fn(),
    number: jest.fn(() => ({
      min: jest.fn().mockReturnThis()
    }))
  }
}));

import { createMocks } from 'node-mocks-http';
import { GET, POST } from '../../src/app/api/habits/route';

describe('/api/habits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock implementations
    mockSupabaseClient.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          range: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    });
  });

  describe('GET /api/habits', () => {
    it('should return 401 when no authorization header', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits'
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => null) },
        url: 'http://localhost:3000/api/habits',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      const response = await GET(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Unauthorized');
    });

    it('should return 401 when authorization header is invalid', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits',
        headers: {
          authorization: 'Invalid token'
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Invalid token') },
        url: 'http://localhost:3000/api/habits',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      const response = await GET(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
    });

    it('should return 401 when user is not found', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        url: 'http://localhost:3000/api/habits',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });
      
      const response = await GET(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Invalid token');
    });

    it('should return habits for authenticated user', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        url: 'http://localhost:3000/api/habits',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockHabits = [
        { id: 'habit-1', title: 'Exercise', user_id: 'user-123' },
        { id: 'habit-2', title: 'Read', user_id: 'user-123' }
      ];

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: mockHabits, error: null })
            })
          })
        })
      });
      
      const response = await GET(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.habits).toEqual(mockHabits);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('habits');
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('valid-token');
    });

    it('should handle query parameters correctly', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits?include_stats=true&limit=10&offset=5',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const searchParams = new URLSearchParams('include_stats=true&limit=10&offset=5');
      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        url: 'http://localhost:3000/api/habits?include_stats=true&limit=10&offset=5',
        nextUrl: { searchParams }
      };

      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const mockRange = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null })
      });

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: mockRange
          })
        })
      });
      
      const response = await GET(mockRequest as any);
      
      expect(mockRange).toHaveBeenCalledWith(5, 14); // offset to offset + limit - 1
      expect(response.status).toBe(200);
    });

    it('should handle database errors', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        url: 'http://localhost:3000/api/habits',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            range: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ 
                data: null, 
                error: { message: 'Database error' }
              })
            })
          })
        })
      });
      
      const response = await GET(mockRequest as any);
      
      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/habits', () => {
    it('should return 401 when no authorization header', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/habits',
        body: {
          title: 'Test Habit',
          frequency: 'daily',
          target_count: 1
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => null) },
        json: jest.fn().mockResolvedValue({
          title: 'Test Habit',
          frequency: 'daily',
          target_count: 1
        })
      };
      
      const response = await POST(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
    });

    it('should create habit for authenticated user', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const habitData = {
        title: 'Test Habit',
        description: 'Test Description',
        frequency: 'daily',
        target_count: 1,
        color: '#FF0000'
      };

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        json: jest.fn().mockResolvedValue(habitData)
      };
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockCreatedHabit = { id: 'habit-1', ...habitData, user_id: 'user-123' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ 
            data: [mockCreatedHabit], 
            error: null 
          })
        })
      });

      // Mock successful zod parsing
      const { z } = require('zod');
      z.object().parse = jest.fn().mockReturnValue(habitData);
      
      const response = await POST(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toEqual(mockCreatedHabit);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('habits');
    });

    it('should handle validation errors', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        json: jest.fn().mockResolvedValue({
          title: '', // Invalid empty title
        })
      };
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Mock zod validation error
      const { z } = require('zod');
      z.object().parse = jest.fn(() => {
        throw new Error('Title is required');
      });
      
      const response = await POST(mockRequest as any);
      const responseData = await response.json();
      
      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
    });

    it('should handle database insert errors', async () => {
      const { req } = createMocks({
        method: 'POST',
        url: '/api/habits',
        headers: {
          authorization: 'Bearer valid-token'
        }
      });

      const habitData = {
        title: 'Test Habit',
        frequency: 'daily',
        target_count: 1
      };

      const mockRequest = {
        ...req,
        headers: { get: jest.fn(() => 'Bearer valid-token') },
        json: jest.fn().mockResolvedValue(habitData)
      };
      
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Insert failed' }
          })
        })
      });

      // Mock successful zod parsing
      const { z } = require('zod');
      z.object().parse = jest.fn().mockReturnValue(habitData);
      
      const response = await POST(mockRequest as any);
      
      expect(response.status).toBe(500);
    });
  });
});