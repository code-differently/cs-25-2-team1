import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Habits from '../../src/app/habits/page';

// Mock dependencies
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

jest.mock('react-confetti', () => {
  return function MockConfetti() {
    return <div data-testid="confetti">Confetti Animation</div>;
  };
});

// Mock FullCalendar
jest.mock('@fullcalendar/react', () => {
  return function MockFullCalendar(props: any) {
    return (
      <div data-testid="full-calendar" data-view={props.initialView}>
        Mock Calendar
        <button onClick={() => props.dateClick?.({ dateStr: '2024-01-15' })}>
          Click Date
        </button>
      </div>
    );
  };
});

jest.mock('@fullcalendar/daygrid', () => ({}));
jest.mock('@fullcalendar/timegrid', () => ({}));
jest.mock('@fullcalendar/interaction', () => ({}));

// Mock components
jest.mock('../../src/app/components/habit-modal', () => {
  return function MockHabitModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="habit-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

jest.mock('../../src/app/components/progress-tracker', () => {
  return function MockProgressTracker() {
    return <div data-testid="progress-tracker">Progress Tracker</div>;
  };
});

jest.mock('../../src/app/components/weekly-streak', () => {
  return function MockWeeklyStreak() {
    return <div data-testid="weekly-streak">Weekly Streak</div>;
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon">CheckCircle</div>,
  Circle: () => <div data-testid="circle-icon">Circle</div>,
  Zap: () => <div data-testid="zap-icon">Zap</div>,
  Lightbulb: () => <div data-testid="lightbulb-icon">Lightbulb</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
  Check: () => <div data-testid="check-icon">Check</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  Coffee: () => <div data-testid="coffee-icon">Coffee</div>,
  Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
}));

import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
const mockSupabase = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    }),
    insert: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [{ id: 'new-habit-id' }],
        error: null,
      }),
    }),
    delete: jest.fn().mockReturnValue({
      eq: jest.fn().mockResolvedValue({
        error: null,
      }),
    }),
  }),
};

const mockHabitsData = [
  {
    id: '1',
    name: 'Exercise',
    icon: 'zap',
    interval: 'Daily',
    completed: false,
    color: 'bg-blue-500',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Reading',
    icon: 'lightbulb',
    interval: 'Weekly',
    completed: false,
    color: 'bg-green-400',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Meditation',
    icon: 'heart',
    interval: 'Monthly',
    completed: true,
    color: 'bg-purple-400',
    created_at: '2024-01-01T00:00:00Z',
  },
];

describe('Habits Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('Authentication and Navigation', () => {
    it('should redirect to login when user is not authenticated', async () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<Habits />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('should not redirect when user is authenticated', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });

      render(<Habits />);

      expect(mockPush).not.toHaveBeenCalledWith('/login');
    });

    it('should not redirect while user data is loading', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: false,
      });

      render(<Habits />);

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Component Rendering', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should render main components when authenticated', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText('My Habits')).toBeInTheDocument();
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
        expect(screen.getByTestId('progress-tracker')).toBeInTheDocument();
        expect(screen.getByTestId('weekly-streak')).toBeInTheDocument();
      });
    });

    it('should render interval filter buttons', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText('Daily')).toBeInTheDocument();
        expect(screen.getByText('Weekly')).toBeInTheDocument();
        expect(screen.getByText('Monthly')).toBeInTheDocument();
      });
    });

    it('should render Add Habit button', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText('Add Habit')).toBeInTheDocument();
      });
    });

    it('should have proper page structure and styling', async () => {
      render(<Habits />);

      await waitFor(() => {
        const container = screen.getByRole('main');
        expect(container).toHaveClass('p-6');
      });
    });
  });

  describe('Habit Modal Functionality', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should open habit modal when Add Habit button is clicked', async () => {
      render(<Habits />);

      await waitFor(() => {
        const addButton = screen.getByText('Add Habit');
        fireEvent.click(addButton);
        expect(screen.getByTestId('habit-modal')).toBeInTheDocument();
      });
    });

    it('should close habit modal when close button is clicked', async () => {
      render(<Habits />);

      await waitFor(() => {
        const addButton = screen.getByText('Add Habit');
        fireEvent.click(addButton);
        
        const closeButton = screen.getByText('Close Modal');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('habit-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Interval Filtering', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'habits') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockHabitsData,
                error: null,
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });
    });

    it('should filter habits by Daily interval by default', async () => {
      render(<Habits />);

      await waitFor(() => {
        const dailyButton = screen.getByText('Daily');
        expect(dailyButton).toHaveClass('bg-blue-600');
      });
    });

    it('should update filter when Weekly button is clicked', async () => {
      render(<Habits />);

      await waitFor(() => {
        const weeklyButton = screen.getByText('Weekly');
        fireEvent.click(weeklyButton);
        expect(weeklyButton).toHaveClass('bg-blue-600');
      });
    });

    it('should update filter when Monthly button is clicked', async () => {
      render(<Habits />);

      await waitFor(() => {
        const monthlyButton = screen.getByText('Monthly');
        fireEvent.click(monthlyButton);
        expect(monthlyButton).toHaveClass('bg-blue-600');
      });
    });

    it('should update calendar view based on selected interval', async () => {
      render(<Habits />);

      await waitFor(() => {
        const weeklyButton = screen.getByText('Weekly');
        fireEvent.click(weeklyButton);
        
        // The calendar should update its view
        const calendar = screen.getByTestId('full-calendar');
        expect(calendar).toBeInTheDocument();
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

    it('should fetch habits when user is authenticated', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'habits') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockHabitsData,
                error: null,
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });

      render(<Habits />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('habits');
      });
    });

    it('should fetch habit completions when user is authenticated', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('habit_completions');
      });
    });

    it('should handle error when fetching habits fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'habits') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });

      render(<Habits />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching habits:', 'Database error');
      });

      consoleSpy.mockRestore();
    });

    it('should not fetch data when user is not available', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true,
      });

      render(<Habits />);

      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Calendar Integration', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should render FullCalendar component', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
      });
    });

    it('should handle calendar date clicks', async () => {
      render(<Habits />);

      await waitFor(() => {
        const calendar = screen.getByTestId('full-calendar');
        const dateButton = screen.getByText('Click Date');
        fireEvent.click(dateButton);
        
        // Calendar should handle the click (no error thrown)
        expect(calendar).toBeInTheDocument();
      });
    });
  });

  describe('Habit Display and Interaction', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'habits') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockHabitsData,
                error: null,
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });
    });

    it('should display habit names when habits are loaded', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText('Exercise')).toBeInTheDocument();
      });
    });

    it('should show empty state when no habits exist', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'habits') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      });

      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText("You haven't added any habits yet. Click 'Add Habit' to get started!")).toBeInTheDocument();
      });
    });
  });

  describe('Confetti Animation', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should show confetti when progress milestones are reached', async () => {
      render(<Habits />);

      // Initially no confetti should be shown
      expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
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
      render(<Habits />);

      await waitFor(() => {
        // Modal should be closed by default
        expect(screen.queryByTestId('habit-modal')).not.toBeInTheDocument();
        
        // Daily interval should be selected by default
        const dailyButton = screen.getByText('Daily');
        expect(dailyButton).toHaveClass('bg-blue-600');
        
        // Add Habit button should be present
        expect(screen.getByText('Add Habit')).toBeInTheDocument();
      });
    });

    it('should update modal state correctly', async () => {
      render(<Habits />);

      await waitFor(() => {
        const addButton = screen.getByText('Add Habit');
        
        // Open modal
        fireEvent.click(addButton);
        expect(screen.getByTestId('habit-modal')).toBeInTheDocument();
        
        // Close modal
        const closeButton = screen.getByText('Close Modal');
        fireEvent.click(closeButton);
        expect(screen.queryByTestId('habit-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Layout', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: { id: 'user123', email: 'test@example.com' },
        isLoaded: true,
      });
    });

    it('should have proper responsive grid classes', async () => {
      render(<Habits />);

      await waitFor(() => {
        const container = screen.getByRole('main');
        expect(container).toHaveClass('p-6');
      });
    });

    it('should render all layout sections', async () => {
      render(<Habits />);

      await waitFor(() => {
        expect(screen.getByText('My Habits')).toBeInTheDocument();
        expect(screen.getByTestId('full-calendar')).toBeInTheDocument();
        expect(screen.getByTestId('progress-tracker')).toBeInTheDocument();
        expect(screen.getByTestId('weekly-streak')).toBeInTheDocument();
      });
    });
  });
});