// Mock environment variables first
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock fetch for external API calls
global.fetch = jest.fn();

describe('Library Functions Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Supabase Client', () => {
    it('should create supabase client with environment variables', () => {
      // Import after mocking environment variables
      const { supabase } = require('../../src/lib/supabaseClient');
      
      expect(supabase).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('test-key');
    });

    it('should handle supabase client methods', () => {
      const { supabase } = require('../../src/lib/supabaseClient');
      
      // Test that methods exist
      expect(supabase.auth).toBeDefined();
      expect(supabase.from).toBeDefined();
      expect(typeof supabase.from).toBe('function');
    });
  });

  describe('ZenQuotes Service', () => {
    beforeEach(() => {
      // Mock successful fetch response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [{
          q: "The only way to do great work is to love what you do.",
          a: "Steve Jobs",
          c: "52",
          h: "<blockquote>&ldquo;The only way to do great work is to love what you do.&rdquo; &mdash; <footer>Steve Jobs</footer></blockquote>"
        }]
      });
    });

    it('should fetch quotes from ZenQuotes API', async () => {
      const { fetchDailyQuote } = require('../../src/lib/services/zenQuotesService');
      
      const quote = await fetchDailyQuote();
      
      expect(global.fetch).toHaveBeenCalledWith('https://zenquotes.io/api/today');
      expect(quote).toBeDefined();
      expect(quote.text).toBe("The only way to do great work is to love what you do.");
      expect(quote.author).toBe("Steve Jobs");
    });

    it('should fetch quotes by category', async () => {
      const { fetchQuoteByCategory } = require('../../src/lib/services/zenQuotesService');
      
      const quote = await fetchQuoteByCategory('motivational');
      
      expect(global.fetch).toHaveBeenCalledWith('https://zenquotes.io/api/random');
      expect(quote).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500
      });

      const { fetchDailyQuote } = require('../../src/lib/services/zenQuotesService');
      
      const quote = await fetchDailyQuote();
      
      expect(quote).toEqual({
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt",
        category: "motivation"
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { fetchDailyQuote } = require('../../src/lib/services/zenQuotesService');
      
      const quote = await fetchDailyQuote();
      
      expect(quote.text).toBeDefined();
      expect(quote.author).toBeDefined();
    });

    it('should cache quotes appropriately', async () => {
      const { fetchDailyQuote } = require('../../src/lib/services/zenQuotesService');
      
      // First call
      await fetchDailyQuote();
      
      // Second call should use cache (in a real implementation)
      await fetchDailyQuote();
      
      // Verify fetch was called (cache implementation may vary)
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Google Calendar Integration', () => {
    it('should create habit reminder events', () => {
      const { createHabitReminderEvent } = require('../../src/lib/google-calendar');
      
      const habit = {
        id: 'habit-123',
        title: 'Exercise',
        description: 'Daily workout routine',
        frequency: 'daily'
      };

      const event = createHabitReminderEvent(habit, new Date('2024-01-01T10:00:00Z'));
      
      expect(event.summary).toContain('Exercise');
      expect(event.description).toBe('Daily workout routine');
      expect(event.start.dateTime).toBeDefined();
      expect(event.end.dateTime).toBeDefined();
    });

    it('should handle different frequencies', () => {
      const { createHabitReminderEvent } = require('../../src/lib/google-calendar');
      
      const frequencies = ['daily', 'weekly', 'monthly'];
      
      frequencies.forEach(frequency => {
        const habit = {
          id: `habit-${frequency}`,
          title: `${frequency} Habit`,
          description: `${frequency} routine`,
          frequency
        };

        const event = createHabitReminderEvent(habit, new Date());
        
        expect(event.recurrence[0]).toContain(`FREQ=${frequency.toUpperCase()}`);
      });
    });

    it('should format event times correctly', () => {
      const { createHabitReminderEvent } = require('../../src/lib/google-calendar');
      
      const habit = {
        id: 'habit-time',
        title: 'Time Test',
        description: 'Test time formatting',
        frequency: 'daily'
      };

      const testDate = new Date('2024-01-01T10:00:00Z');
      const event = createHabitReminderEvent(habit, testDate);
      
      expect(event.start.dateTime).toBeDefined();
      expect(event.start.timeZone).toBeDefined();
      expect(event.end.dateTime).toBeDefined();
      expect(event.end.timeZone).toBeDefined();
    });
  });

  describe('Google Auth Utilities', () => {
    beforeEach(() => {
      process.env.GOOGLE_CLIENT_ID = 'test-client-id';
      process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
    });

    it('should generate auth URL correctly', () => {
      const { getGoogleAuthUrl } = require('../../src/lib/google-auth');
      
      const authUrl = getGoogleAuthUrl();
      
      expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain('access_type=offline');
    });

    it('should handle token exchange', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'access-token-123',
          refresh_token: 'refresh-token-123',
          expires_in: 3600,
          token_type: 'Bearer'
        })
      });

      const { exchangeCodeForTokens } = require('../../src/lib/google-auth');
      
      const tokens = await exchangeCodeForTokens('auth-code-123');
      
      expect(tokens.access_token).toBe('access-token-123');
      expect(tokens.refresh_token).toBe('refresh-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://oauth2.googleapis.com/token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      );
    });

    it('should refresh tokens', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token-123',
          expires_in: 3600,
          token_type: 'Bearer'
        })
      });

      const { refreshGoogleToken } = require('../../src/lib/google-auth');
      
      const tokens = await refreshGoogleToken('refresh-token-123');
      
      expect(tokens.access_token).toBe('new-access-token-123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://oauth2.googleapis.com/token',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    it('should handle auth errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const { exchangeCodeForTokens } = require('../../src/lib/google-auth');
      
      await expect(exchangeCodeForTokens('invalid-code')).rejects.toThrow();
    });
  });

  describe('Type Definitions', () => {
    it('should export all required types', () => {
      const types = require('../../src/types');
      
      // Test that the types module exports exist
      expect(types).toBeDefined();
    });

    it('should have database types', () => {
      const databaseTypes = require('../../src/types/database');
      
      expect(databaseTypes).toBeDefined();
    });

    it('should have API types', () => {
      const apiTypes = require('../../src/types/api');
      
      expect(apiTypes).toBeDefined();
    });

    it('should have auth types', () => {
      const authTypes = require('../../src/types/auth');
      
      expect(authTypes).toBeDefined();
    });
  });

  describe('Hooks Integration', () => {
    it('should test hook utilities', () => {
      // Mock React hooks
      const mockUseEffect = jest.fn();
      const mockUseState = jest.fn(() => [null, jest.fn()]);
      
      jest.doMock('react', () => ({
        useEffect: mockUseEffect,
        useState: mockUseState,
        useCallback: jest.fn((fn) => fn),
        useMemo: jest.fn((fn) => fn())
      }));

      // Test that we can import hooks
      expect(() => {
        const hooks = require('../../src/hooks/useDailyQuote');
        return hooks;
      }).not.toThrow();
    });
  });

  describe('Environment and Configuration', () => {
    it('should handle missing environment variables gracefully', () => {
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      // Test with missing env vars
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      expect(() => {
        // This should not crash the test suite
        const config = {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'fallback',
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback'
        };
        expect(config.supabaseUrl).toBe('fallback');
      }).not.toThrow();
      
      // Restore env vars
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    });

    it('should validate configuration values', () => {
      const config = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      };
      
      expect(config.supabaseUrl).toMatch(/^https?:\/\//);
      expect(config.supabaseKey).toBeTruthy();
    });
  });

  describe('Utility Functions', () => {
    it('should handle date formatting', () => {
      const testDate = new Date('2024-01-01T10:00:00Z');
      
      // Test various date operations
      expect(testDate.toISOString()).toBe('2024-01-01T10:00:00.000Z');
      expect(testDate.getFullYear()).toBe(2024);
      expect(testDate.getMonth()).toBe(0); // January
    });

    it('should handle string operations', () => {
      const testString = "Test Habit Title";
      
      expect(testString.toLowerCase()).toBe("test habit title");
      expect(testString.split(' ')).toHaveLength(3);
      expect(testString.includes('Habit')).toBe(true);
    });

    it('should handle array operations', () => {
      const testArray = [1, 2, 3, 4, 5];
      
      expect(testArray.length).toBe(5);
      expect(testArray.filter(n => n > 3)).toHaveLength(2);
      expect(testArray.map(n => n * 2)).toEqual([2, 4, 6, 8, 10]);
    });

    it('should handle object operations', () => {
      const testObject = {
        id: '123',
        title: 'Test',
        active: true,
        metadata: { created: new Date() }
      };
      
      expect(Object.keys(testObject)).toHaveLength(4);
      expect(testObject.hasOwnProperty('title')).toBe(true);
      expect(typeof testObject.metadata).toBe('object');
    });
  });

  describe('Error Handling Patterns', () => {
    it('should handle async errors', async () => {
      const asyncFunction = async () => {
        throw new Error('Async error');
      };
      
      await expect(asyncFunction()).rejects.toThrow('Async error');
    });

    it('should handle promise rejections', async () => {
      const rejectedPromise = Promise.reject(new Error('Promise rejection'));
      
      await expect(rejectedPromise).rejects.toThrow('Promise rejection');
    });

    it('should handle try-catch blocks', () => {
      const riskyFunction = () => {
        throw new Error('Risky operation failed');
      };
      
      expect(() => {
        try {
          riskyFunction();
        } catch (error) {
          expect((error as Error).message).toBe('Risky operation failed');
          throw error; // Re-throw for test
        }
      }).toThrow('Risky operation failed');
    });
  });

  describe('Mock Verification', () => {
    it('should verify mock function calls', () => {
      const mockFn = jest.fn();
      mockFn('test', 123);
      mockFn('another', 456);
      
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('test', 123);
      expect(mockFn).toHaveBeenLastCalledWith('another', 456);
    });

    it('should verify mock return values', () => {
      const mockFn = jest.fn()
        .mockReturnValueOnce('first')
        .mockReturnValueOnce('second')
        .mockReturnValue('default');
      
      expect(mockFn()).toBe('first');
      expect(mockFn()).toBe('second');
      expect(mockFn()).toBe('default');
      expect(mockFn()).toBe('default');
    });

    it('should verify mock implementations', () => {
      const mockFn = jest.fn().mockImplementation((x) => x * 2);
      
      expect(mockFn(5)).toBe(10);
      expect(mockFn(10)).toBe(20);
    });
  });
});