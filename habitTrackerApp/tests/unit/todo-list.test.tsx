import { render, screen, fireEvent } from '@testing-library/react';
import ToDoList, { TodoListProps, Habit } from '../../src/app/components/todo-list';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle: () => <div data-testid="check-circle-icon">✓</div>,
  Circle: () => <div data-testid="circle-icon">○</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  Lightbulb: () => <div data-testid="lightbulb-icon">💡</div>,
  Heart: () => <div data-testid="heart-icon">❤️</div>,
  Briefcase: () => <div data-testid="briefcase-icon">💼</div>,
  Check: () => <div data-testid="check-icon">✔️</div>,
  Lock: () => <div data-testid="lock-icon">🔒</div>,
  Coffee: () => <div data-testid="coffee-icon">☕</div>,
  Sparkles: () => <div data-testid="sparkles-icon">✨</div>,
}));

describe('ToDoList Component', () => {
  const mockHabits: Habit[] = [
    {
      id: '1',
      name: 'Morning Exercise',
      icon: 'zap',
      interval: 'Daily',
      completed: false,
    },
    {
      id: '2',
      name: 'Read a Book',
      icon: 'lightbulb',
      interval: 'Daily',
      completed: true,
    },
    {
      id: '3',
      name: 'Meditation',
      icon: 'heart',
      interval: 'Daily',
      completed: false,
    },
  ];

  const defaultProps: TodoListProps = {
    className: '',
    habits: mockHabits,
    onToggleHabit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the title correctly', () => {
    render(<ToDoList {...defaultProps} />);
    
    expect(screen.getByText("Today's Habits")).toBeInTheDocument();
  });

  it('displays all habits when provided', () => {
    render(<ToDoList {...defaultProps} />);
    
    expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
    expect(screen.getByText('Read a Book')).toBeInTheDocument();
    expect(screen.getByText('Meditation')).toBeInTheDocument();
  });

  it('shows empty state message when no habits are provided', () => {
    render(<ToDoList habits={[]} />);
    
    expect(screen.getByText('No habits yet. Click "Add Habit" to get started!')).toBeInTheDocument();
  });

  it('displays correct icons for each habit', () => {
    render(<ToDoList {...defaultProps} />);
    
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  it('shows different completion states correctly', () => {
    render(<ToDoList {...defaultProps} />);
    
    // Completed habit should show check circle
    expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    
    // Incomplete habits should show empty circles
    const circleIcons = screen.getAllByTestId('circle-icon');
    expect(circleIcons).toHaveLength(2);
  });

  it('applies line-through styling to completed habits', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    const readBookHabit = screen.getByText('Read a Book');
    expect(readBookHabit).toHaveClass('line-through', 'text-gray-500');
    
    const morningExerciseHabit = screen.getByText('Morning Exercise');
    expect(morningExerciseHabit).toHaveClass('text-gray-800');
    expect(morningExerciseHabit).not.toHaveClass('line-through');
  });

  it('calls onToggleHabit when habit item is clicked', () => {
    const mockToggle = jest.fn();
    render(<ToDoList {...defaultProps} onToggleHabit={mockToggle} />);
    
    const habitItem = screen.getByText('Morning Exercise').closest('div');
    fireEvent.click(habitItem!);
    
    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('displays habit intervals correctly', () => {
    render(<ToDoList {...defaultProps} />);
    
    const dailyIntervals = screen.getAllByText('Daily');
    expect(dailyIntervals).toHaveLength(3);
  });

  it('handles missing onToggleHabit prop gracefully', () => {
    render(<ToDoList habits={mockHabits} />);
    
    const habitItem = screen.getByText('Morning Exercise').closest('div');
    
    // Should not throw error when clicked without onToggleHabit
    expect(() => {
      fireEvent.click(habitItem!);
    }).not.toThrow();
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-todo-class';
    const { container } = render(<ToDoList {...defaultProps} className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('has correct responsive structure', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('w-full', 'lg:w-64');
    
    const cardContainer = container.querySelector('.bg-gray-200.rounded-3xl');
    expect(cardContainer).toBeInTheDocument();
    expect(cardContainer).toHaveClass('h-80', 'sm:h-96');
  });

  it('has scrollable content area', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    const scrollableArea = container.querySelector('.overflow-y-auto');
    expect(scrollableArea).toBeInTheDocument();
    expect(scrollableArea).toHaveClass('flex-1', 'space-y-3');
  });

  it('handles different icon types correctly', () => {
    const habitsWithDifferentIcons: Habit[] = [
      { id: '1', name: 'Coffee', icon: 'coffee', interval: 'Daily', completed: false },
      { id: '2', name: 'Work', icon: 'briefcase', interval: 'Daily', completed: false },
      { id: '3', name: 'Security', icon: 'lock', interval: 'Daily', completed: false },
    ];

    render(<ToDoList habits={habitsWithDifferentIcons} />);
    
    expect(screen.getByTestId('coffee-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('truncates long habit names correctly', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    const habitNames = container.querySelectorAll('.truncate');
    expect(habitNames.length).toBeGreaterThan(0);
  });

  it('has proper hover states', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    const habitItems = container.querySelectorAll('.hover\\:bg-gray-50');
    expect(habitItems).toHaveLength(3);
  });

  it('maintains proper spacing and layout', () => {
    const { container } = render(<ToDoList {...defaultProps} />);
    
    // Check main container padding
    const cardContainer = container.querySelector('.py-6.px-4.sm\\:px-6.lg\\:px-8');
    expect(cardContainer).toBeInTheDocument();
    
    // Check habit item spacing
    const habitItem = container.querySelector('.gap-2.p-2');
    expect(habitItem).toBeInTheDocument();
  });
});
