import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
  })),
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase,
}));

// Import after mocking
import { GET } from '../../src/app/api/analytics/dashboard/route';

describe('Analytics Dashboard API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const { req } = createMocks({ 
        method: 'GET',
        url: '/api/analytics/dashboard',
      });
      
      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('No valid authorization token');
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'InvalidToken',
        },
      });

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('No valid authorization token');
    });

    it('should return 401 when token is invalid', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer invalid-token',
        },
      });

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
      expect(data.message).toBe('Invalid token');
    });

    it('should return analytics data when valid token is provided', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      const mockUser = { user: { id: 'user-123' } };
      const mockHabitsStats = [
        { id: '1', is_active: true, created_at: '2024-01-01' },
        { id: '2', is_active: false, created_at: '2024-01-02' },
        { id: '3', is_active: true, created_at: '2024-01-03' },
      ];

      const mockRecentLogs = [
        {
          id: '1',
          completed_at: '2024-01-15T10:00:00Z',
          habits: { name: 'Exercise', color: 'blue' },
        },
        {
          id: '2',
          completed_at: '2024-01-14T09:00:00Z',
          habits: { name: 'Reading', color: 'green' },
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      // Mock habits stats query
      const mockHabitsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockHabitsStats,
          error: null,
        }),
      };

      // Mock total completions query
      const mockCompletionsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          count: 150,
          error: null,
        }),
      };

      // Mock recent logs query
      const mockLogsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: mockRecentLogs,
          error: null,
        }),
      };

      // Setup complex mock chain
      mockSupabase.from
        .mockReturnValueOnce(mockHabitsQuery) // habits query
        .mockReturnValueOnce(mockCompletionsQuery) // completions count
        .mockReturnValueOnce(mockLogsQuery); // recent logs

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.totalHabits).toBe(3);
      expect(data.data.activeHabits).toBe(2);
      expect(data.data.totalCompletions).toBe(150);
      expect(data.data.recentActivity).toEqual(mockRecentLogs);

      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('valid-token');
      expect(mockSupabase.from).toHaveBeenCalledWith('habits');
      expect(mockSupabase.from).toHaveBeenCalledWith('habit_logs');
    });

    it('should handle empty habits data', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      const mockUser = { user: { id: 'user-123' } };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const mockEmptyQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
      };

      const mockCompletionsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          count: 0,
          error: null,
        }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockEmptyQuery) // habits query
        .mockReturnValueOnce(mockCompletionsQuery) // completions count
        .mockReturnValueOnce(mockEmptyQuery); // recent logs

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.totalHabits).toBe(0);
      expect(data.data.activeHabits).toBe(0);
      expect(data.data.totalCompletions).toBe(0);
    });

    it('should return 500 when database query fails', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      const mockUser = { user: { id: 'user-123' } };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const mockFailedQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockRejectedValue(new Error('Database connection failed')),
      };

      mockSupabase.from.mockReturnValue(mockFailedQuery);

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
      expect(data.message).toBe('Something went wrong fetching dashboard analytics');
    });

    it('should handle auth service errors', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      mockSupabase.auth.getUser.mockRejectedValue(new Error('Auth service error'));

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
      expect(data.message).toBe('Something went wrong fetching dashboard analytics');
    });

    it('should calculate completion rate correctly with data', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/analytics/dashboard',
        headers: {
          authorization: 'Bearer valid-token',
        },
      });

      const mockUser = { user: { id: 'user-123' } };
      const mockHabitsStats = [
        { id: '1', is_active: true },
        { id: '2', is_active: true },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const mockHabitsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockHabitsStats,
          error: null,
        }),
      };

      const mockCompletionsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          count: 75, // 75 completions out of possible habits
          error: null,
        }),
      };

      const mockLogsQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockHabitsQuery)
        .mockReturnValueOnce(mockCompletionsQuery)
        .mockReturnValueOnce(mockLogsQuery);

      const request = new NextRequest('http://localhost:3000/api/analytics/dashboard', {
        method: 'GET',
        headers: req.headers as any,
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.totalCompletions).toBe(75);
    });
  });
});