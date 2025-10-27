/**
 * @jest-environment node
 */

// Mock Supabase admin client
const mockSupabaseAdmin = {
  from: jest.fn().mockReturnValue({
    insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    update: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: null, error: null })
    }),
    delete: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: null, error: null })
    }),
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: [], error: null })
    })
  })
};

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: null, error: null })
      })
    }),
    update: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: null, error: null })
    }),
    delete: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({ data: null, error: null })
    })
  })
};

jest.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseAdmin)
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: jest.fn(() => mockSupabase)
}));

jest.mock('next/headers', () => ({
  cookies: {}
}));

// Mock Google Calendar Service
const mockGoogleCalendar = {
  createRecurringHabitReminder: jest.fn().mockResolvedValue({ id: 'calendar-event-123' }),
  getHabitEvents: jest.fn().mockResolvedValue([])
};

jest.mock('@/lib/google-calendar', () => ({
  GoogleCalendarService: jest.fn(() => mockGoogleCalendar),
  createHabitReminderEvent: jest.fn(() => ({
    summary: 'Test Habit',
    description: 'Test Description',
    start: { dateTime: '2024-01-01T10:00:00Z' },
    end: { dateTime: '2024-01-01T10:30:00Z' },
    recurrence: ['RRULE:FREQ=DAILY']
  }))
}));

describe('API Routes - Habits CRUD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/habits/[id]', () => {
    it('should update habit successfully', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        json: jest.fn().mockResolvedValue({
          title: 'Updated Habit',
          description: 'Updated Description'
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'habit-1', user_id: 'test-user' },
              error: null
            })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue({
              data: [{ id: 'habit-1', title: 'Updated Habit' }],
              error: null
            })
          })
        })
      });

      const { PUT } = await import('../../src/app/api/habits/[id]/route');
      const response = await PUT(mockRequest as any, { params: { id: 'habit-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 404 for non-existent habit', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        json: jest.fn().mockResolvedValue({
          title: 'Updated Habit'
        })
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' } // Not found error
            })
          })
        })
      });

      const { PUT } = await import('../../src/app/api/habits/[id]/route');
      const response = await PUT(mockRequest as any, { params: { id: 'non-existent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });
  });

  describe('DELETE /api/habits/[id]', () => {
    it('should delete habit successfully', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        }
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'habit-1', user_id: 'test-user' },
              error: null
            })
          })
        }),
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      });

      const { DELETE } = await import('../../src/app/api/habits/[id]/route');
      const response = await DELETE(mockRequest as any, { params: { id: 'habit-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 403 for unauthorized deletion', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        }
      };

      // Mock habit owned by different user
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'habit-1', user_id: 'other-user' },
              error: null
            })
          })
        })
      });

      const { DELETE } = await import('../../src/app/api/habits/[id]/route');
      const response = await DELETE(mockRequest as any, { params: { id: 'habit-1' } });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });
});

describe('API Routes - Habit Logs Individual', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE /api/habit-logs/[id]', () => {
    it('should delete habit log successfully', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        }
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { 
                id: 'log-1', 
                habits: { user_id: 'test-user' }
              },
              error: null
            })
          })
        }),
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      });

      const { DELETE } = await import('../../src/app/api/habit-logs/[id]/route');
      const response = await DELETE(mockRequest as any, { params: { id: 'log-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});

describe('API Routes - Calendar Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/calendar/reminders', () => {
    it('should create calendar reminder successfully', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          habitId: 'habit-1',
          habitTitle: 'Exercise',
          habitDescription: 'Daily exercise routine',
          reminderTime: '2024-01-01T10:00:00Z',
          frequency: 'daily',
          googleAccessToken: 'google-token-123'
        })
      };

      // Mock authenticated session
      const mockSession = { user: { id: 'test-user' } };
      mockSupabase.auth.getSession = jest.fn().mockResolvedValue({
        data: { session: mockSession }
      });

      const { POST } = await import('../../src/app/api/calendar/reminders/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockGoogleCalendar.createRecurringHabitReminder).toHaveBeenCalled();
    });

    it('should return 400 for missing Google access token', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          habitId: 'habit-1',
          habitTitle: 'Exercise'
          // Missing googleAccessToken
        })
      };

      // Mock authenticated session
      const mockSession = { user: { id: 'test-user' } };
      mockSupabase.auth.getSession = jest.fn().mockResolvedValue({
        data: { session: mockSession }
      });

      const { POST } = await import('../../src/app/api/calendar/reminders/route');
      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Google Calendar access token required');
    });
  });

  describe('GET /api/calendar/reminders', () => {
    it('should fetch calendar events successfully', async () => {
      const url = new URL('http://localhost:3000/api/calendar/reminders');
      url.searchParams.set('startDate', '2024-01-01');
      url.searchParams.set('endDate', '2024-01-31');
      url.searchParams.set('accessToken', 'google-token-123');

      const mockRequest = {
        url: url.toString(),
        nextUrl: { searchParams: url.searchParams }
      };

      // Mock authenticated session
      const mockSession = { user: { id: 'test-user' } };
      mockSupabase.auth.getSession = jest.fn().mockResolvedValue({
        data: { session: mockSession }
      });

      mockGoogleCalendar.getHabitEvents.mockResolvedValue([
        { id: 'event-1', summary: 'Exercise Reminder' }
      ]);

      const { GET } = await import('../../src/app/api/calendar/reminders/route');
      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toBeDefined();
      expect(mockGoogleCalendar.getHabitEvents).toHaveBeenCalledWith(
        '2024-01-01',
        '2024-01-31'
      );
    });
  });
});

describe('API Routes - Integration Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/integrations/google', () => {
    it('should handle Google integration setup', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        json: jest.fn().mockResolvedValue({
          access_token: 'google-access-token',
          refresh_token: 'google-refresh-token',
          expires_at: new Date().toISOString()
        })
      };

      mockSupabaseAdmin.from.mockReturnValue({
        upsert: jest.fn().mockResolvedValue({
          data: [{ user_id: 'test-user' }],
          error: null
        })
      });

      const { POST } = await import('../../src/app/api/integrations/[service]/route');
      const response = await POST(mockRequest as any, { params: { service: 'google' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should return 400 for unsupported service', async () => {
      const mockRequest = {
        headers: {
          get: jest.fn(() => 'Bearer valid-token')
        },
        json: jest.fn().mockResolvedValue({})
      };

      const { POST } = await import('../../src/app/api/integrations/[service]/route');
      const response = await POST(mockRequest as any, { params: { service: 'unsupported' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Unsupported service');
    });
  });
});

describe('API Routes - Auth Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/auth/google/callback', () => {
    it('should handle Google OAuth callback', async () => {
      const url = new URL('http://localhost:3000/api/auth/google/callback');
      url.searchParams.set('code', 'auth-code-123');

      const mockRequest = {
        url: url.toString(),
        nextUrl: { searchParams: url.searchParams }
      };

      // Mock Google token exchange
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          access_token: 'google-access-token',
          refresh_token: 'google-refresh-token',
          expires_in: 3600
        })
      } as any);

      const { GET } = await import('../../src/app/api/auth/google/callback/route');
      const response = await GET(mockRequest as any);

      expect(response.status).toBe(302); // Redirect response
    });

    it('should handle missing authorization code', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/auth/google/callback',
        nextUrl: { searchParams: new URLSearchParams() }
      };

      const { GET } = await import('../../src/app/api/auth/google/callback/route');
      const response = await GET(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Authorization code not provided');
    });
  });
});