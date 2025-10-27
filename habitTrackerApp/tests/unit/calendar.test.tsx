// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: jest.fn()
    }
  })
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Calendar from '../../src/app/calendar/page';

const mockSupabase = {
  auth: {
    getSession: jest.fn()
  }
};

const mockPush = jest.fn();

describe('Calendar Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should render calendar page when authenticated', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-123' } } }
    });

    render(<Calendar />);

    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Calendar page is working! 📅')).toBeInTheDocument();
    expect(screen.getByText('Habit Calendar')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null }
    });

    render(<Calendar />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should display calendar description', () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-123' } } }
    });

    render(<Calendar />);

    expect(screen.getByText(/Track your habits over time with a visual calendar view/)).toBeInTheDocument();
    expect(screen.getByText(/This page will show your habit completion patterns and streaks/)).toBeInTheDocument();
  });

  it('should have proper styling structure', () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-123' } } }
    });

    const { container } = render(<Calendar />);
    
    expect(container.firstChild).toHaveClass('max-w-7xl', 'mx-auto', 'p-8');
  });

  it('should handle session check errors gracefully', async () => {
    mockSupabase.auth.getSession.mockRejectedValueOnce(new Error('Session error'));

    render(<Calendar />);

    // Component should still render without crashing
    expect(screen.getByText('Calendar')).toBeInTheDocument();
  });
});