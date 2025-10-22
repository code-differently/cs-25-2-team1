import { render, screen, fireEvent } from '@testing-library/react';
import { Welcome, WelcomeProps } from '../../src/app/components/welcome';

describe('Welcome Component', () => {
  const defaultProps: WelcomeProps = {
    userName: 'Jane',
    className: '',
    onAddHabit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<Welcome {...defaultProps} />);
    
    expect(screen.getByText('Welcome in,')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Habit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Journal' })).toBeInTheDocument();
  });

  it('displays custom userName', () => {
    render(<Welcome {...defaultProps} userName="John" />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Jane')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    const { container } = render(<Welcome {...defaultProps} className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('calls onAddHabit when Add Habit button is clicked', () => {
    const mockOnAddHabit = jest.fn();
    render(<Welcome {...defaultProps} onAddHabit={mockOnAddHabit} />);
    
    const addHabitButton = screen.getByRole('button', { name: 'Add Habit' });
    fireEvent.click(addHabitButton);
    
    expect(mockOnAddHabit).toHaveBeenCalledTimes(1);
  });

  it('renders without onAddHabit prop', () => {
    render(<Welcome userName="Test" />);
    
    expect(screen.getByText('Welcome in,')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('has correct button styling and hover states', () => {
    render(<Welcome {...defaultProps} />);
    
    const addHabitButton = screen.getByRole('button', { name: 'Add Habit' });
    const journalButton = screen.getByRole('button', { name: 'Journal' });
    
    expect(addHabitButton).toHaveClass('bg-blue-500', 'text-white');
    expect(journalButton).toHaveClass('bg-white', 'border-2', 'border-indigo-700', 'text-indigo-700');
  });

  it('renders with responsive classes', () => {
    const { container } = render(<Welcome {...defaultProps} />);
    const mainDiv = container.firstChild;
    
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'sm:flex-row');
  });
});
