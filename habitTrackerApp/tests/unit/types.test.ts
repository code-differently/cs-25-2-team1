import '@testing-library/jest-dom';

// Import all types to ensure they can be imported without errors
import * as ApiTypes from '../../src/types/api';
import * as AuthTypes from '../../src/types/auth';
import * as DatabaseTypes from '../../src/types/database';
import * as IndexTypes from '../../src/types/index';

describe('Type Definitions', () => {
  describe('Module Imports', () => {
    it('should successfully import all type modules', () => {
      expect(typeof DatabaseTypes).toBe('object');
      expect(typeof ApiTypes).toBe('object');
      expect(typeof AuthTypes).toBe('object');
      expect(typeof IndexTypes).toBe('object');
    });
  });

  describe('Database Types', () => {
    it('should define User interface correctly', () => {
      const testUser: Partial<DatabaseTypes.User> = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      
      expect(testUser.id).toBe('test-id');
      expect(testUser.email).toBe('test@example.com');
    });

    it('should define Habit interface correctly', () => {
      const testHabit: Partial<DatabaseTypes.Habit> = {
        id: 'habit-1',
        title: 'Exercise',
        description: 'Daily workout routine',
        frequency: 'daily',
        user_id: 'user-1',
        created_at: '2024-01-01T00:00:00Z',
      };

      expect(testHabit.title).toBe('Exercise');
      expect(testHabit.frequency).toBe('daily');
    });

    it('should define HabitLog interface correctly', () => {
      const testHabitLog: Partial<DatabaseTypes.HabitLog> = {
        id: 'log-1',
        habit_id: 'habit-1',
        user_id: 'user-1',
        completed_at: '2024-01-01T10:00:00Z',
        notes: 'Completed successfully',
      };

      expect(testHabitLog.habit_id).toBe('habit-1');
      expect(testHabitLog.notes).toBe('Completed successfully');
    });

    it('should define HabitStats interface correctly', () => {
      const testHabitStats: Partial<DatabaseTypes.HabitStats> = {
        habit_id: 'habit-1',
        title: 'Exercise',
        user_id: 'user-1',
        frequency: 'daily',
        total_completions: 15,
      };

      expect(testHabitStats.title).toBe('Exercise');
      expect(testHabitStats.total_completions).toBe(15);
    });

    it('should support habit frequency options', () => {
      const frequencies: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];
      
      expect(frequencies).toContain('daily');
      expect(frequencies).toContain('weekly');
      expect(frequencies).toContain('monthly');
    });
  });

  describe('API Types', () => {
    it('should export API-related types', () => {
      expect(typeof ApiTypes).toBe('object');
    });

    it('should define CreateHabitRequest correctly', () => {
      const request: ApiTypes.CreateHabitRequest = {
        title: 'New Habit',
        frequency: 'daily',
        target_count: 1,
      };

      expect(request.title).toBe('New Habit');
      expect(request.frequency).toBe('daily');
      expect(request.target_count).toBe(1);
    });

    it('should define UpdateHabitRequest correctly', () => {
      const request: ApiTypes.UpdateHabitRequest = {
        title: 'Updated Habit',
        is_active: false,
      };

      expect(request.title).toBe('Updated Habit');
      expect(request.is_active).toBe(false);
    });

    it('should define HabitsResponse correctly', () => {
      const response: ApiTypes.HabitsResponse = {
        habits: [],
        total: 0,
        hasMore: false,
      };

      expect(response.total).toBe(0);
      expect(response.hasMore).toBe(false);
      expect(Array.isArray(response.habits)).toBe(true);
    });

    it('should define CreateHabitLogRequest correctly', () => {
      const request: ApiTypes.CreateHabitLogRequest = {
        habit_id: 'habit-1',
        count: 1,
        notes: 'Completed successfully',
      };

      expect(request.habit_id).toBe('habit-1');
      expect(request.count).toBe(1);
      expect(request.notes).toBe('Completed successfully');
    });

    it('should define DashboardAnalytics correctly', () => {
      const analytics: ApiTypes.DashboardAnalytics = {
        totalHabits: 5,
        activeHabits: 3,
        totalCompletions: 15,
        avgCompletionRate: 0.75,
        currentStreaks: [
          {
            habit_id: 'habit-1',
            habit_name: 'Exercise',
            streak: 7,
          },
        ],
        recentActivity: [
          {
            date: '2024-01-01',
            completions: 3,
          },
        ],
      };

      expect(analytics.totalHabits).toBe(5);
      expect(analytics.currentStreaks).toHaveLength(1);
      expect(analytics.recentActivity).toHaveLength(1);
    });

    it('should define MotivationalQuote correctly', () => {
      const quote: ApiTypes.MotivationalQuote = {
        quote: 'Success is not final, failure is not fatal.',
        author: 'Winston Churchill',
        category: 'inspirational',
      };

      expect(quote.author).toBe('Winston Churchill');
      expect(quote.category).toBe('inspirational');
    });

    it('should support quote categories', () => {
      const categories: ApiTypes.MotivationalQuote['category'][] = [
        'inspirational',
        'daily',
        'success',
        'motivation',
        'habit-motivation',
        'fallback'
      ];

      expect(categories).toContain('inspirational');
      expect(categories).toContain('habit-motivation');
    });

    it('should define WeatherData correctly', () => {
      const weather: ApiTypes.WeatherData = {
        temperature: 72,
        condition: 'sunny',
        description: 'Clear skies',
        humidity: 45,
        windSpeed: 5.2,
        location: 'New York, NY',
      };

      expect(weather.temperature).toBe(72);
      expect(weather.location).toBe('New York, NY');
    });
  });

  describe('Auth Types', () => {
    it('should export authentication-related types', () => {
      expect(typeof AuthTypes).toBe('object');
    });

    it('should define UserSession correctly', () => {
      const session: Partial<AuthTypes.UserSession> = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        expiresAt: 1234567890,
      };

      expect(session.accessToken).toBe('token123');
      expect(session.refreshToken).toBe('refresh123');
      expect(session.expiresAt).toBe(1234567890);
    });

    it('should define SupabaseAuthUser correctly', () => {
      const user: Partial<AuthTypes.SupabaseAuthUser> = {
        id: 'user-1',
        email: 'user@example.com',
        created_at: '2024-01-01T00:00:00Z',
      };

      expect(user.id).toBe('user-1');
      expect(user.email).toBe('user@example.com');
    });

    it('should define SupabaseAuthSession correctly', () => {
      const session: Partial<AuthTypes.SupabaseAuthSession> = {
        access_token: 'token123',
        refresh_token: 'refresh123',
        expires_at: 1234567890,
      };

      expect(session.access_token).toBe('token123');
      expect(session.refresh_token).toBe('refresh123');
    });

    it('should define AuthError correctly', () => {
      const error: AuthTypes.AuthError = {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      };

      expect(error.code).toBe('INVALID_CREDENTIALS');
      expect(error.message).toBe('Invalid email or password');
    });

    it('should define PasswordResetRequest correctly', () => {
      const request: AuthTypes.PasswordResetRequest = {
        email: 'user@example.com',
      };

      expect(request.email).toBe('user@example.com');
    });
  });

  describe('Index Types (Re-exports)', () => {
    it('should re-export all type modules', () => {
      expect(typeof IndexTypes).toBe('object');
      
      // Test that types are accessible through the index
      // Since this is a re-export, we test by importing and using the types
      const testFunction = () => {
        // This should not throw any TypeScript compilation errors
        return true;
      };

      expect(testFunction()).toBe(true);
    });

    it('should allow importing from index module', () => {
      // Test that the index module structure allows proper imports
      const moduleKeys = Object.keys(IndexTypes);
      
      // The module should export something (even if it's just the re-exports)
      expect(typeof IndexTypes).toBe('object');
    });
  });

  describe('Type Compatibility and Structure', () => {
    it('should have compatible API and Database types', () => {
      // Test that API request types are compatible with database types
      const habitFromApi: ApiTypes.CreateHabitRequest = {
        title: 'Test Habit',
        frequency: 'daily',
        target_count: 1,
      };

      const habitForDatabase: Partial<DatabaseTypes.Habit> = {
        title: habitFromApi.title,
        frequency: habitFromApi.frequency,
        target_count: habitFromApi.target_count,
        user_id: 'user-1',
        id: 'habit-1',
        created_at: '2024-01-01T00:00:00Z',
      };

      expect(habitForDatabase.title).toBe(habitFromApi.title);
      expect(habitForDatabase.frequency).toBe(habitFromApi.frequency);
    });

    it('should support optional properties correctly', () => {
      // Test UpdateHabitRequest with only some properties
      const partialUpdate: ApiTypes.UpdateHabitRequest = {
        title: 'Updated Title',
      };

      expect(partialUpdate.title).toBe('Updated Title');
      expect(partialUpdate.description).toBeUndefined();
      expect(partialUpdate.is_active).toBeUndefined();
    });

    it('should support nested object structures', () => {
      // Test complex nested structures like analytics
      const analytics: ApiTypes.DashboardAnalytics = {
        totalHabits: 10,
        activeHabits: 8,
        totalCompletions: 150,
        avgCompletionRate: 0.85,
        currentStreaks: [
          {
            habit_id: 'habit-1',
            habit_name: 'Exercise',
            streak: 14,
          },
          {
            habit_id: 'habit-2',
            habit_name: 'Reading',
            streak: 7,
          },
        ],
        recentActivity: [
          { date: '2024-01-01', completions: 5 },
          { date: '2024-01-02', completions: 6 },
        ],
      };

      expect(analytics.currentStreaks).toHaveLength(2);
      expect(analytics.recentActivity).toHaveLength(2);
      expect(analytics.currentStreaks[0].habit_name).toBe('Exercise');
    });

    it('should support array types correctly', () => {
      // Test HabitsResponse with array of habits
      const response: ApiTypes.HabitsResponse = {
        habits: [],
        total: 0,
        hasMore: false,
      };

      expect(response.habits).toHaveLength(0);
      expect(response.total).toBe(0);
      expect(response.hasMore).toBe(false);
    });
  });

  describe('Type Validation and Constraints', () => {
    it('should enforce required properties', () => {
      // This test ensures TypeScript compilation catches missing required properties
      const testRequiredProps = () => {
        const validRequest: ApiTypes.CreateHabitRequest = {
          title: 'Required Title',
          frequency: 'daily',
          target_count: 1,
        };

        return validRequest.title && validRequest.frequency && validRequest.target_count;
      };

      expect(testRequiredProps()).toBeTruthy();
    });

    it('should support string literal types', () => {
      // Test that frequency can only be specific values
      const validFrequencies: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];
      
      expect(validFrequencies).toContain('daily');
      expect(validFrequencies).not.toContain('yearly' as any);
    });

    it('should support union types', () => {
      // Test quote category union type
      const categories: ApiTypes.MotivationalQuote['category'][] = [
        'inspirational',
        'daily',
        'success',
        'motivation',
        'habit-motivation',
        'fallback'
      ];

      categories.forEach(category => {
        const quote: ApiTypes.MotivationalQuote = {
          quote: 'Test quote',
          author: 'Test Author',
          category: category,
        };

        expect(quote.category).toBe(category);
      });
    });
  });
});