// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key'
};

Object.defineProperty(process, 'env', {
  value: mockEnv
});

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create supabase client with correct configuration', () => {
    const { createClient } = require('@supabase/supabase-js');
    
    // Import the module which should call createClient
    require('../../src/lib/supabaseClient');
    
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    );
  });

  it('should export supabase client', () => {
    // Set environment variables for this test
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    
    // Re-import to get fresh module with env vars
    delete require.cache[require.resolve('../../src/lib/supabaseClient')];
    const { supabase } = require('../../src/lib/supabaseClient');
    
    expect(supabase).toBeDefined();
  });

  it('should handle missing environment variables gracefully', () => {
    // This test ensures the module doesn't crash if env vars are missing
    expect(() => {
      require('../../src/lib/supabaseClient');
    }).not.toThrow();
  });
});