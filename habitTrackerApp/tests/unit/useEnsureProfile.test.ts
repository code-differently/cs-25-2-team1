import { renderHook } from '@testing-library/react';

// Mock the supabase client completely
jest.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({ 
        data: { 
          subscription: { unsubscribe: jest.fn() } 
        } 
      }))
    },
    from: jest.fn(() => ({ 
      upsert: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Import after mocking
const useEnsureProfile = require('../../src/hooks/useEnsureProfile').default;

describe('useEnsureProfile', () => {
  it('should render without errors', () => {
    // Just test that the hook can be called without throwing
    const { result } = renderHook(() => useEnsureProfile());
    expect(result.current).toBeUndefined(); // Hook doesn't return anything
  });

  it('should accept optional display name', () => {
    const { result } = renderHook(() => useEnsureProfile('Test User'));
    expect(result.current).toBeUndefined();
  });
});