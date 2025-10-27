/**
 * @jest-environment node
 */

// Mock Supabase client
const mockSupabaseResponse = { data: [] as any[], error: null as any };
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue(mockSupabaseResponse),
  insert: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue(mockSupabaseResponse)
};

const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn().mockReturnValue(mockSupabaseQuery)
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase
}));

// Mock Next.js utilities
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (data: any, options?: { status?: number }) => ({
      status: options?.status || 200,
      json: () => Promise.resolve(data)
    })
  }
}));

describe('API Routes - Habit Logs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseResponse.data = [];
    mockSupabaseResponse.error = null;
  });

  describe('GET /api/habit-logs', () => {
    it('should return 401 without valid auth', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => null)
        },
        nextUrl: { searchParams: new URLSearchParams() }
      };

      // Import and test the route handler
      const { GET } = await import('../../src/app/api/habit-logs/route');
      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return habit logs for authenticated user', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn((header: string) => {
            if (header === 'authorization') return 'Bearer valid-token';
            return null;
          })
        },
        nextUrl: { 
          searchParams: new URLSearchParams('habit_id=habit-1&limit=10&offset=0')
        }
      };

      const mockUser = { id: 'user-123' };
      const mockLogs = [
        { id: 'log-1', habit_id: 'habit-1', user_id: 'user-123' }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseResponse.data = mockLogs;

      const { GET } = await import('../../src/app/api/habit-logs/route');
      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('habit_logs');
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('POST /api/habit-logs', () => {
    it('should create habit log for authenticated user', async () => {
      const logData = {
        habit_id: 'habit-1',
        count: 1,
        notes: 'Completed today'
      };

      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        json: jest.fn().mockResolvedValue(logData)
      };

      const mockUser = { id: 'user-123' };
      const mockCreatedLog = { id: 'log-1', ...logData, user_id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseResponse.data = [mockCreatedLog];

      const { POST } = await import('../../src/app/api/habit-logs/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockSupabaseQuery.insert).toHaveBeenCalled();
    });
  });
});

describe('API Routes - Users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseResponse.data = [];
    mockSupabaseResponse.error = null;
  });

  describe('POST /api/users/create-profile', () => {
    it('should return 400 for missing required fields', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({})
      };

      const { POST } = await import('../../src/app/api/users/create-profile/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing userId or email');
    });

    it('should create user profile successfully', async () => {
      const userData = {
        userId: 'user-123',
        email: 'test@example.com'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(userData)
      };

      mockSupabaseResponse.data = [{ id: 'user-123', email: 'test@example.com' }];

      const { POST } = await import('../../src/app/api/users/create-profile/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
    });

    it('should handle database errors', async () => {
      const userData = {
        userId: 'user-123',
        email: 'test@example.com'
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(userData)
      };

      mockSupabaseResponse.error = { message: 'Database error' };

      const { POST } = await import('../../src/app/api/users/create-profile/route');
      const response = await POST(mockRequest as any);

      expect(response.status).toBe(500);
    });
  });
});

describe('API Routes - Calendar Reminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseResponse.data = [];
    mockSupabaseResponse.error = null;
  });

  describe('POST /api/calendar/reminders', () => {
    it('should return 401 without valid session', async () => {
      // Mock cookies and Supabase server client
      const mockCookies = {};
      const mockServerClient = {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: null }
          })
        }
      };

      jest.doMock('next/headers', () => ({
        cookies: mockCookies
      }));

      jest.doMock('@supabase/auth-helpers-nextjs', () => ({
        createServerComponentClient: jest.fn(() => mockServerClient)
      }));

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          habitId: 'habit-1',
          habitTitle: 'Exercise',
          reminderTime: '2024-01-01T10:00:00Z',
          frequency: 'daily'
        })
      };

      const { POST } = await import('../../src/app/api/calendar/reminders/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});

describe('API Routes - Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseResponse.data = [];
    mockSupabaseResponse.error = null;
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should return analytics data for authenticated user', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        }
      };

      const mockUser = { id: 'user-123' };
      const mockStats = {
        total_habits: 5,
        active_habits: 3,
        completed_today: 2
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Mock multiple Supabase calls for analytics
      mockSupabase.from
        .mockReturnValueOnce({ // habits count
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { count: 5 },
                error: null
              })
            }))
          }))
        })
        .mockReturnValueOnce({ // active habits
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { count: 3 },
                error: null
              })
            }))
          }))
        });

      const { GET } = await import('../../src/app/api/analytics/dashboard/route');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(200);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('GET /api/analytics/habit-stats', () => {
    it('should return habit statistics', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        nextUrl: {
          searchParams: new URLSearchParams('habit_id=habit-1&days=30')
        }
      };

      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      mockSupabaseResponse.data = [
        { date: '2024-01-01', count: 1 },
        { date: '2024-01-02', count: 1 }
      ];

      const { GET } = await import('../../src/app/api/analytics/habit-stats/route');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(200);
      expect(mockSupabase.from).toHaveBeenCalledWith('habit_logs');
    });
  });
});

describe('API Routes - Authentication', () => {
  describe('GET /api/auth/google', () => {
    it('should redirect to Google OAuth', async () => {
      // Mock environment variables
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';
      process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';

      const { GET } = await import('../../src/app/api/auth/google/route');
      const response = await GET();

      expect(response.status).toBe(302);
    });
  });
});