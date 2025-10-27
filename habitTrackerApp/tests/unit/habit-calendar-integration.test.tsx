import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitCalendarIntegration from '../../src/app/components/HabitCalendarIntegration';

// Mock fetch and supabase
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({})
}));

describe('HabitCalendarIntegration', () => {
  const fakeUser = {
    id: 'user1',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '',
  };
  const defaultProps = {
    user: fakeUser,
    habitId: 'habit1',
    habitName: 'Read a book',
    isGoogleConnected: true,
  };

  it('disables button and shows loading when creating', async () => {
    // Simulate slow fetch
    let resolveFetch;
    mockFetch.mockImplementationOnce(() => new Promise(res => { resolveFetch = res; }));
    window.alert = jest.fn();
    render(<HabitCalendarIntegration {...defaultProps} />);
    const button = screen.getByText(/Add Calendar Reminder/i);
    fireEvent.click(button);
    // Button should show loading
    expect(screen.getByText(/Creating.../i)).toBeInTheDocument();
    // Finish fetch
    resolveFetch({ ok: true, json: async () => ({}) });
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Calendar reminder created successfully!');
    });
  });

  it('alerts if user tries to create reminder when not connected', () => {
    window.alert = jest.fn();
    render(<HabitCalendarIntegration {...defaultProps} isGoogleConnected={false} />);
    // Try to click button (should not exist)
    expect(screen.queryByText(/Add Calendar Reminder/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Connect Google Calendar/i)).toBeInTheDocument();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows connect message if Google is not connected', () => {
    render(<HabitCalendarIntegration {...defaultProps} isGoogleConnected={false} />);
    expect(screen.getByText(/Connect Google Calendar/i)).toBeInTheDocument();
  });

  it('renders add reminder button if Google is connected', () => {
    render(<HabitCalendarIntegration {...defaultProps} />);
    expect(screen.getByText(/Add Calendar Reminder/i)).toBeInTheDocument();
  });

  it('creates a calendar reminder on button click', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    window.alert = jest.fn();
    render(<HabitCalendarIntegration {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add Calendar Reminder/i));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/calendar/reminders', expect.objectContaining({ method: 'POST' }));
      expect(window.alert).toHaveBeenCalledWith('Calendar reminder created successfully!');
      expect(screen.getByText(/Calendar reminder active/i)).toBeInTheDocument();
    });
  });

  it('shows error alert if reminder creation fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    window.alert = jest.fn();
    render(<HabitCalendarIntegration {...defaultProps} />);
    fireEvent.click(screen.getByText(/Add Calendar Reminder/i));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to create calendar reminder. Please try again.');
    });
  });
});
