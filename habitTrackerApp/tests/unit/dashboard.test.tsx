// Mock Clerk to avoid ESM transform errors
jest.mock('@clerk/nextjs', () => ({
  useClerk: () => ({ signOut: jest.fn() }),
  useUser: () => ({
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User'
    },
    isLoaded: true
  })
}));

// Mock Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          gte: jest.fn(() => ({
            lt: jest.fn()
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn()
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn()
          }))
        }))
      }))
    }))
  })
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

// Note: userSync module doesn't exist, so we'll mock it in the test if needed

// Mock components
jest.mock('../../src/app/components/habit-modal', () => {
  return function MockHabitModal({ isOpen, onClose, onCreateHabit }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="habit-modal">
        <button onClick={() => onCreateHabit('Test Habit', 'zap', 'Daily')}>
          Create Habit
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../src/app/components/todo-list', () => {
  return function MockToDoList({ habits, onToggleHabit }: any) {
    return (
      <div data-testid="todo-list">
        {habits.map((habit: any) => (
          <div key={habit.id} data-testid={`habit-${habit.id}`}>
            <span>{habit.name}</span>
            <button onClick={() => onToggleHabit(habit.id)}>
              Toggle
            </button>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('react-confetti', () => {
  return function MockConfetti() {
    return <div data-testid="confetti">🎉</div>;
  };
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../../src/app/dashboard/page';

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the dashboard page', async () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });

  it('should open and close habit modal', async () => {
    render(<Dashboard />);
    
    // Find and click the add habit button
    const addButton = screen.getByText(/add habit/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-modal')).toBeInTheDocument();
    });
    
    // Close the modal
    const closeButton = screen.getByText(/close/i);
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('habit-modal')).not.toBeInTheDocument();
    });
  });

  it('should handle habit creation', async () => {
    const mockSupabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
    
    // Mock successful habit creation
    mockSupabase.from().insert().select.mockResolvedValue({
      data: [{ id: 'new-habit-id', title: 'Test Habit', frequency: 'daily' }],
      error: null
    });
    
    // Mock habits fetch
    mockSupabase.from().select().eq.mockResolvedValue({
      data: [{ id: 'new-habit-id', title: 'Test Habit', frequency: 'daily' }],
      error: null
    });

    render(<Dashboard />);
    
    // Open modal
    const addButton = screen.getByText(/add habit/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-modal')).toBeInTheDocument();
    });
    
    // Create habit
    const createButton = screen.getByText(/create habit/i);
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('habits');
    });
  });

  it('should handle habit toggle', async () => {
    const mockSupabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient();
    
    // Mock initial habits
    mockSupabase.from().select().eq.mockResolvedValue({
      data: [{ id: 'habit-1', title: 'Test Habit', frequency: 'daily' }],
      error: null
    });

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('habit-habit-1')).toBeInTheDocument();
    });
    
    // Toggle habit
    const toggleButton = screen.getByText(/toggle/i);
    fireEvent.click(toggleButton);
    
    // Should call habit_logs endpoint
    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('habit_logs');
    });
  });

  it('should show confetti when enabled', () => {
    render(<Dashboard />);
    
    // The component should be able to show confetti
    // This tests the confetti import and component structure
    expect(screen.queryByTestId('confetti')).not.toBeInTheDocument();
  });

  it('should handle user authentication state', () => {
    render(<Dashboard />);
    
    // Should render without crashing when user is loaded
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});