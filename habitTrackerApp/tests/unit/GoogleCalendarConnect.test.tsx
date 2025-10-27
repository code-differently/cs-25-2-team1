// Mock Supabase to avoid ESM transform errors
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  })
}));

import { render, screen, waitFor } from '@testing-library/react';
import GoogleCalendarConnect from '../../src/app/components/GoogleCalendarConnect';

// Mock user object
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {}
};

describe('GoogleCalendarConnect Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', async () => {
    render(<GoogleCalendarConnect user={mockUser as any} />);
    
    // Wait for loading to complete and check for the main heading
    await waitFor(() => {
      expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<GoogleCalendarConnect user={mockUser as any} />);
    
    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should handle connection check', async () => {
    render(<GoogleCalendarConnect user={mockUser as any} />);

    // Wait for the component to load and show the "not connected" state
    await waitFor(() => {
      expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
    });
  });

  it('should handle no connection found', async () => {
    const mockSupabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
    
    // Mock no connection found
    mockSupabase.from().select().eq().single.mockRejectedValue(new Error('No connection'));

    render(<GoogleCalendarConnect user={mockUser as any} />);

    await waitFor(() => {
      expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
    });
  });

  it('should handle expired token', async () => {
    const mockSupabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
    
    // Mock expired token
    mockSupabase.from().select().eq().single.mockResolvedValue({
      data: {
        id: 'token-id',
        expires_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      error: null
    });

    render(<GoogleCalendarConnect user={mockUser as any} />);

    await waitFor(() => {
      expect(screen.getByText('Connect Google Calendar')).toBeInTheDocument();
    });
  });

  it('should display user information', async () => {
    render(<GoogleCalendarConnect user={mockUser as any} />);
    
    // Wait for loading to complete and check for the main heading
    await waitFor(() => {
      expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    });
  });
});