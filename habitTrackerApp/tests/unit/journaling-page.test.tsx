import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Journaling from '../../src/app/journaling/page';

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock FullCalendar
jest.mock('@fullcalendar/react', () => {
  return function MockFullCalendar(props: any) {
    return (
      <div data-testid="full-calendar">
        Mock Calendar
        <button 
          onClick={() => props.dateClick?.({ dateStr: '2024-01-15' })}
          data-testid="calendar-date-click"
        >
          Click Date
        </button>
        {props.events?.map((event: any, index: number) => (
          <div key={index} data-testid="calendar-event">
            {event.title}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@fullcalendar/daygrid', () => ({}));
jest.mock('@fullcalendar/interaction', () => ({}));

import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const mockSupabase = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      }),
    }),
    upsert: jest.fn().mockResolvedValue({
      data: [{ id: '1', note: 'Test note', date: '2024-01-15', user_id: 'user123' }],
      error: null,
    }),
  }),
};

const mockJournalEntries = [
  { date: '2024-01-10', note: 'First journal entry' },
  { date: '2024-01-12', note: 'Second journal entry' },
  { date: '2024-01-15', note: 'Third journal entry' },
];

describe('Journaling Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('Authentication Flow', () => {
    it('should render when user is authenticated', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });

      render(<Journaling />);

      await waitFor(() => {
        expect(screen.getByText('Daily Journaling')).toBeInTheDocument();
      });
    });

    it('should handle unauthenticated user gracefully', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<Journaling />);

      expect(screen.getByText('Daily Journaling')).toBeInTheDocument();
    });

    it('should handle loading state', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: false,
      });

      render(<Journaling />);

      expect(screen.getByText('Daily Journaling')).toBeInTheDocument();
    });
  });

  describe('Component Rendering', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should render all main components', async () => {
      render(<Journaling />);

      await waitFor(() => {
        expect(screen.getByText('Daily Journaling')).toBeInTheDocument();
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Write your thoughts for today...')).toBeInTheDocument();
        expect(screen.getByText('Save Entry')).toBeInTheDocument();
      });
    });

    it('should render date selector', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
        expect(dateInput).toBeInTheDocument();
      });
    });

    it('should have proper page structure and styling', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const container = screen.getByRole('main');
        expect(container).toHaveClass('p-6');
      });
    });

    it('should render textarea with proper attributes', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveAttribute('rows', '15');
        expect(textarea).toHaveClass('w-full', 'p-4', 'border-2', 'rounded-lg');
      });
    });
  });

  describe('Data Fetching', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should fetch note for selected date', async () => {
      const mockNote = { note: 'Test note for today' };
      
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockNote,
                error: null,
              }),
            }),
          }),
        }),
      }));

      render(<Journaling />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      });
    });

    it('should fetch all dates with notes', async () => {
      const mockDates = mockJournalEntries.map(entry => ({ date: entry.date }));

      // First call for note, second call for dates
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: mockDates,
              error: null,
            }),
          }),
        });

      render(<Journaling />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      });
    });

    it('should handle error when fetching note fails', async () => {
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      }));

      render(<Journaling />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalled();
      });
    });

    it('should not fetch data when user is not available', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<Journaling />);

      // Should not make database calls without user
      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Note Management', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should update note text when typing', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        fireEvent.change(textarea, { target: { value: 'New journal entry' } });
        expect(textarea).toHaveValue('New journal entry');
      });
    });

    it('should save note when Save Entry button is clicked', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        const saveButton = screen.getByText('Save Entry');

        fireEvent.change(textarea, { target: { value: 'New journal entry' } });
        fireEvent.click(saveButton);

        expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      });
    });

    it('should show loading state when saving', async () => {
      let resolveUpsert: (value: any) => void = () => {};
      const upsertPromise = new Promise(resolve => {
        resolveUpsert = resolve;
      });

      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
        upsert: jest.fn().mockReturnValue(upsertPromise),
      }));

      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        const saveButton = screen.getByText('Save Entry');

        fireEvent.change(textarea, { target: { value: 'New journal entry' } });
        fireEvent.click(saveButton);

        expect(saveButton).toBeDisabled();
      });

      // Resolve the promise to complete the test
      resolveUpsert({ data: [], error: null });
    });

    it('should handle save error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'journal_entries') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: null,
                    error: null,
                  }),
                }),
              }),
            }),
            upsert: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Save failed' },
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
          upsert: jest.fn().mockResolvedValue({ data: [], error: null }),
        };
      });

      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        const saveButton = screen.getByText('Save Entry');

        fireEvent.change(textarea, { target: { value: 'New journal entry' } });
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error saving journal entry:', 'Save failed');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Date Selection', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should update selected date when date input changes', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
        fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
        expect(dateInput).toHaveValue('2024-01-20');
      });
    });

    it('should handle calendar date click', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const dateClickButton = screen.getByTestId('calendar-date-click');
        fireEvent.click(dateClickButton);
        
        // Should trigger date change and note fetch
        expect(mockSupabase.from).toHaveBeenCalledWith('journal_entries');
      });
    });

    it('should initialize with today\'s date', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = screen.getByDisplayValue(today);
        expect(dateInput).toBeInTheDocument();
      });
    });
  });

  describe('Calendar Integration', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });

      // Mock dates with notes
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: mockJournalEntries.map(entry => ({ date: entry.date })),
              error: null,
            }),
          }),
        });
    });

    it('should render FullCalendar component', async () => {
      render(<Journaling />);

      await waitFor(() => {
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
      });
    });

    it('should display calendar events for dates with notes', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const calendarEvents = screen.getAllByTestId('calendar-event');
        expect(calendarEvents).toHaveLength(mockJournalEntries.length);
      });
    });

    it('should handle calendar date selection', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const dateClickButton = screen.getByTestId('calendar-date-click');
        fireEvent.click(dateClickButton);
        
        // Calendar interaction should work without errors
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should initialize with correct default state', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = screen.getByDisplayValue(today);
        expect(dateInput).toBeInTheDocument();
        
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveValue('');
        
        const saveButton = screen.getByText('Save Entry');
        expect(saveButton).not.toBeDisabled();
      });
    });

    it('should update note state when existing note is loaded', async () => {
      const mockNote = { note: 'Existing journal entry' };
      
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockNote,
                error: null,
              }),
            }),
          }),
        }),
      }));

      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveValue('Existing journal entry');
      });
    });

    it('should clear note when switching to date with no entry', async () => {
      // First render with existing note
      const mockNote = { note: 'Existing journal entry' };
      
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockNote,
                error: null,
              }),
            }),
          }),
        }),
      }));

      render(<Journaling />);

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveValue('Existing journal entry');
      });

      // Switch to date with no note
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }),
        }),
      }));

      const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      fireEvent.change(dateInput, { target: { value: '2024-01-25' } });

      await waitFor(() => {
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveValue('');
      });
    });
  });

  describe('UI Interactions', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should have proper responsive layout', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const container = screen.getByRole('main');
        expect(container).toHaveClass('p-6');
        
        const gridContainer = container.querySelector('.grid');
        expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-2');
      });
    });

    it('should have accessible form elements', async () => {
      render(<Journaling />);

      await waitFor(() => {
        const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/);
        expect(dateInput).toHaveAttribute('type', 'date');
        
        const textarea = screen.getByPlaceholderText('Write your thoughts for today...');
        expect(textarea).toHaveAttribute('placeholder');
        
        const saveButton = screen.getByText('Save Entry');
        expect(saveButton).toHaveAttribute('type', 'button');
      });
    });
  });
});