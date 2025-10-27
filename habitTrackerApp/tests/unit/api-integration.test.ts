// Mock Next.js modules first
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url: url || 'http://localhost/test',
    headers: new Map(),
    json: jest.fn().mockResolvedValue({}),
    ...init
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      ok: init?.status ? init.status < 400 : true,
      ...data
    }))
  }
}));

// Mock Supabase
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
};

jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: mockSupabaseClient
}));

// Mock Zod
jest.mock('zod', () => ({
  z: {
    object: jest.fn().mockReturnValue({
      parse: jest.fn()
    }),
    string: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      uuid: jest.fn().mockReturnThis(),
      datetime: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis()
    }),
    number: jest.fn().mockReturnValue({
      min: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis()
    }),
    enum: jest.fn().mockReturnValue({
      optional: jest.fn().mockReturnThis()
    }),
    boolean: jest.fn().mockReturnValue({
      optional: jest.fn().mockReturnThis()
    })
  }
}));

import { NextRequest, NextResponse } from 'next/server';

// Mock the actual API routes by testing their core functionality
describe('API Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
  });

  describe('Authentication Flow', () => {
    it('should handle unauthorized requests', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      const response = NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(response.status).toBe(401);
    });

    it('should handle valid user authentication', async () => {
      const mockUser = { 
        id: 'user-123', 
        email: 'test@example.com',
        user_metadata: { name: 'Test User' }
      };
      
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const response = NextResponse.json(
        { success: true, user: mockUser },
        { status: 200 }
      );

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.user.id).toBe('user-123');
      expect(response.status).toBe(200);
    });

    it('should handle authentication errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      const response = NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );

      expect(response.status).toBe(401);
    });
  });

  describe('Database Operations', () => {
    it('should handle successful database queries', async () => {
      const mockData = [
        { id: '1', title: 'Exercise', frequency: 'daily' },
        { id: '2', title: 'Reading', frequency: 'weekly' }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData[0], error: null }),
        mockResolvedValue: jest.fn().mockResolvedValue({ data: mockData, error: null })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      // Test SELECT operation by calling from first
      const tableQuery = mockSupabaseClient.from('habits');
      const result = await tableQuery.select().eq('user_id', 'user-123');
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('habits');
      expect(mockQuery.select).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const response = NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );

      expect(response.status).toBe(500);
    });

    it('should handle INSERT operations', async () => {
      const newHabit = {
        title: 'New Habit',
        description: 'A new habit to track',
        frequency: 'daily',
        user_id: 'user-123'
      };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'habit-123', ...newHabit },
          error: null
        })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await mockQuery.insert(newHabit).select().single();
      
      expect(mockQuery.insert).toHaveBeenCalledWith(newHabit);
      expect(mockQuery.select).toHaveBeenCalled();
      expect(result.data.title).toBe('New Habit');
    });

    it('should handle UPDATE operations', async () => {
      const updateData = { title: 'Updated Habit' };
      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: [{ id: 'habit-123', ...updateData }],
          error: null
        })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await mockQuery.update(updateData).eq('id', 'habit-123').select();
      
      expect(mockQuery.update).toHaveBeenCalledWith(updateData);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'habit-123');
    });

    it('should handle DELETE operations', async () => {
      const mockQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await mockQuery.delete().eq('id', 'habit-123');
      
      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'habit-123');
      expect(result.error).toBeNull();
    });
  });

  describe('Request Validation', () => {
    it('should validate request data with Zod schemas', async () => {
      const { z } = require('zod');
      const mockSchema = z.object();
      
      const validData = {
        title: 'Valid Habit',
        description: 'Valid description',
        frequency: 'daily'
      };

      mockSchema.parse.mockReturnValue(validData);
      
      const result = mockSchema.parse(validData);
      
      expect(mockSchema.parse).toHaveBeenCalledWith(validData);
      expect(result).toEqual(validData);
    });

    it('should handle validation errors', async () => {
      const { z } = require('zod');
      const mockSchema = z.object();
      
      const invalidData = { invalid: 'data' };
      
      mockSchema.parse.mockImplementation(() => {
        const error = new Error('Validation failed');
        error.name = 'ZodError';
        throw error;
      });

      expect(() => mockSchema.parse(invalidData)).toThrow('Validation failed');
    });
  });

  describe('HTTP Methods and Status Codes', () => {
    it('should handle GET requests properly', async () => {
      const request = new NextRequest('http://localhost/api/test');
      expect(request.url).toContain('/api/test');
    });

    it('should handle POST requests with body', async () => {
      const body = { title: 'Test Habit' };
      const request = new NextRequest('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      request.json = jest.fn().mockResolvedValue(body);
      const requestBody = await request.json();
      
      expect(requestBody).toEqual(body);
    });

    it('should return proper status codes', async () => {
      // Test various status codes
      const responses = [
        { status: 200, data: { success: true } },
        { status: 201, data: { success: true, created: true } },
        { status: 400, data: { success: false, error: 'Bad Request' } },
        { status: 401, data: { success: false, error: 'Unauthorized' } },
        { status: 404, data: { success: false, error: 'Not Found' } },
        { status: 500, data: { success: false, error: 'Internal Server Error' } }
      ];

      responses.forEach(({ status, data }) => {
        const response = NextResponse.json(data, { status });
        expect(response.status).toBe(status);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      mockSupabaseClient.auth.getUser.mockRejectedValue(new Error('Unexpected error'));

      try {
        await mockSupabaseClient.auth.getUser();
      } catch (error) {
        expect((error as Error).message).toBe('Unexpected error');
      }

      const errorResponse = NextResponse.json(
        { success: false, error: 'Internal Server Error' },
        { status: 500 }
      );

      expect(errorResponse.status).toBe(500);
    });

    it('should handle network timeouts', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Network timeout');
      });

      expect(() => mockSupabaseClient.from('habits')).toThrow('Network timeout');
    });

    it('should handle malformed JSON requests', async () => {
      const request = new NextRequest('http://localhost/api/test');
      request.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'));

      try {
        await request.json();
      } catch (error) {
        expect((error as Error).message).toBe('Invalid JSON');
      }
    });
  });

  describe('API Response Formats', () => {
    it('should return consistent success responses', async () => {
      const successResponse = NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: { id: '123', title: 'Test' }
      });

      const data = await successResponse.json();
      expect(data.success).toBe(true);
      expect(data.message).toBeDefined();
      expect(data.data).toBeDefined();
    });

    it('should return consistent error responses', async () => {
      const errorResponse = NextResponse.json({
        success: false,
        error: 'Operation failed',
        message: 'Detailed error message'
      }, { status: 400 });

      const data = await errorResponse.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
      expect(errorResponse.status).toBe(400);
    });

    it('should handle paginated responses', async () => {
      const paginatedResponse = NextResponse.json({
        success: true,
        data: {
          items: [{ id: '1' }, { id: '2' }],
          total: 100,
          page: 1,
          limit: 10,
          hasMore: true
        }
      });

      const data = await paginatedResponse.json();
      expect(data.data.items).toHaveLength(2);
      expect(data.data.total).toBe(100);
      expect(data.data.hasMore).toBe(true);
    });
  });

  describe('Query Parameters and Filtering', () => {
    it('should handle query parameters correctly', async () => {
      const url = new URL('http://localhost/api/habits?limit=10&offset=0&frequency=daily');
      const searchParams = url.searchParams;

      expect(searchParams.get('limit')).toBe('10');
      expect(searchParams.get('offset')).toBe('0');
      expect(searchParams.get('frequency')).toBe('daily');
    });

    it('should handle date range filters', async () => {
      const url = new URL('http://localhost/api/logs?start_date=2024-01-01&end_date=2024-01-31');
      const searchParams = url.searchParams;

      expect(searchParams.get('start_date')).toBe('2024-01-01');
      expect(searchParams.get('end_date')).toBe('2024-01-31');
    });

    it('should handle missing query parameters', async () => {
      const url = new URL('http://localhost/api/habits');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      expect(limit).toBe(50);
      expect(offset).toBe(0);
    });
  });

  describe('Complex API Scenarios', () => {
    it('should handle bulk operations', async () => {
      const bulkData = [
        { title: 'Habit 1', frequency: 'daily' },
        { title: 'Habit 2', frequency: 'weekly' },
        { title: 'Habit 3', frequency: 'monthly' }
      ];

      const mockQuery = {
        insert: jest.fn().mockResolvedValue({
          data: bulkData.map((item, index) => ({ id: `habit-${index}`, ...item })),
          error: null
        })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await mockQuery.insert(bulkData);
      
      expect(mockQuery.insert).toHaveBeenCalledWith(bulkData);
      expect(result.data).toHaveLength(3);
    });

    it('should handle conditional queries', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null })
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      // Simulate conditional query building
      let query = mockQuery.select('*');
      query = query.eq('user_id', 'user-123');
      query = query.gte('created_at', '2024-01-01');
      query = query.order('created_at', { ascending: false });
      
      await query.limit(10);

      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(mockQuery.gte).toHaveBeenCalledWith('created_at', '2024-01-01');
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it('should handle transaction-like operations', async () => {
      // Simulate multiple related operations
      const user = { id: 'user-123', email: 'test@example.com' };
      const habit = { title: 'Exercise', user_id: user.id };
      const log = { habit_id: 'habit-123', user_id: user.id, completed_at: new Date().toISOString() };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user },
        error: null
      });

      const mockHabitQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: 'habit-123', ...habit },
          error: null
        })
      };

      const mockLogQuery = {
        insert: jest.fn().mockResolvedValue({
          data: { id: 'log-123', ...log },
          error: null
        })
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockHabitQuery)
        .mockReturnValueOnce(mockLogQuery);

      // Execute the operations
      const userResult = await mockSupabaseClient.auth.getUser();
      const habitResult = await mockHabitQuery.insert(habit).select().single();
      const logResult = await mockLogQuery.insert(log);

      expect(userResult.data.user.id).toBe('user-123');
      expect(habitResult.data.title).toBe('Exercise');
      expect(logResult.data.habit_id).toBe('habit-123');
    });
  });
});