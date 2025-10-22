import { render, screen, fireEvent } from '@testing-library/react';
import HabitModal from '../../src/app/components/habit-modal';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">✕</div>,
  Zap: () => <div data-testid="zap-icon">⚡</div>,
  Lightbulb: () => <div data-testid="lightbulb-icon">💡</div>,
  Heart: () => <div data-testid="heart-icon">❤️</div>,
  Briefcase: () => <div data-testid="briefcase-icon">💼</div>,
  Check: () => <div data-testid="check-icon">✔️</div>,
  Lock: () => <div data-testid="lock-icon">🔒</div>,
  Coffee: () => <div data-testid="coffee-icon">☕</div>,
  Sparkles: () => <div data-testid="sparkles-icon">✨</div>,
}));

describe('HabitModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onCreateHabit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(<HabitModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('New Habit')).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<HabitModal {...defaultProps} />);
    
    expect(screen.getByText('New Habit')).toBeInTheDocument();
    
    // Fix: Test for form elements by their role instead of labels
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Intervals')).toBeInTheDocument();
    expect(screen.getByText('Icons')).toBeInTheDocument();
    
    // Verify form inputs exist
    const textInputs = screen.getAllByRole('textbox');
    expect(textInputs).toHaveLength(2); // Name and Description inputs
    
    // Verify buttons exist
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<HabitModal {...defaultProps} onClose={mockOnClose} />);
    
    const closeButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(closeButton!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<HabitModal {...defaultProps} onClose={mockOnClose} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('updates form fields correctly', () => {
    render(<HabitModal {...defaultProps} />);
    
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0] as HTMLInputElement;
    const descriptionInput = inputs[1] as HTMLInputElement;
    
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    
    expect(nameInput.value).toBe('Test Habit');
    expect(descriptionInput.value).toBe('Test Description');
  });

  it('opens and closes intervals dropdown', () => {
    render(<HabitModal {...defaultProps} />);
    
    const dropdownButton = screen.getByText('Select');
    
    // Initially should show down arrow
    expect(screen.getByText('∨')).toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(dropdownButton);
    
    // Should show up arrow and interval options
    expect(screen.getByText('∧')).toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
  });

  it('selects interval from dropdown', () => {
    render(<HabitModal {...defaultProps} />);
    
    // Open dropdown
    const dropdownButton = screen.getByText('Select');
    fireEvent.click(dropdownButton);
    
    // Select Daily
    const dailyOption = screen.getByText('Daily');
    fireEvent.click(dailyOption);
    
    // Dropdown should close and show selected value
    expect(screen.queryByText('Weekly')).not.toBeInTheDocument();
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('∨')).toBeInTheDocument();
  });

  it('renders all available icons', () => {
    render(<HabitModal {...defaultProps} />);
    
    expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lightbulb-icon')).toBeInTheDocument();
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('coffee-icon')).toBeInTheDocument();
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
  });

  it('selects icon correctly', () => {
    const { container } = render(<HabitModal {...defaultProps} />);
    
    const zapIcon = screen.getByTestId('zap-icon').closest('button');
    fireEvent.click(zapIcon!);
    
    // Should have ring styling to indicate selection
    expect(zapIcon).toHaveClass('ring-4', 'ring-blue-500');
  });

  it('creates habit with valid form data', () => {
    const mockOnCreateHabit = jest.fn();
    render(<HabitModal {...defaultProps} onCreateHabit={mockOnCreateHabit} />);
    
    // Fill out form
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0];
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    
    // Select interval
    fireEvent.click(screen.getByText('Select'));
    fireEvent.click(screen.getByText('Daily'));
    
    // Select icon
    const zapIcon = screen.getByTestId('zap-icon').closest('button');
    fireEvent.click(zapIcon!);
    
    // Submit form
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(mockOnCreateHabit).toHaveBeenCalledWith('Test Habit', 'zap', 'Daily');
  });

  it('does not create habit with incomplete form data', () => {
    const mockOnCreateHabit = jest.fn();
    render(<HabitModal {...defaultProps} onCreateHabit={mockOnCreateHabit} />);
    
    // Only fill name, missing interval and icon
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0];
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    expect(mockOnCreateHabit).not.toHaveBeenCalled();
  });

  it('resets form after successful submission', () => {
    const mockOnClose = jest.fn();
    const mockOnCreateHabit = jest.fn();
    
    render(<HabitModal {...defaultProps} onClose={mockOnClose} onCreateHabit={mockOnCreateHabit} />);
    
    // Fill out complete form
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs[0] as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    
    fireEvent.click(screen.getByText('Select'));
    fireEvent.click(screen.getByText('Daily'));
    
    const zapIcon = screen.getByTestId('zap-icon').closest('button');
    fireEvent.click(zapIcon!);
    
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnCreateHabit).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('has correct modal overlay and positioning', () => {
    const { container } = render(<HabitModal {...defaultProps} />);
    
    const overlay = container.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    
    const modal = container.querySelector('.bg-white.rounded-3xl');
    expect(modal).toBeInTheDocument();
  });

  it('has proper form validation styling', () => {
    render(<HabitModal {...defaultProps} />);
    
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveClass('border-2', 'border-black', 'rounded-full');
    });
  });

  it('highlights selected interval option', () => {
    render(<HabitModal {...defaultProps} />);
    
    // Open dropdown and select an option
    fireEvent.click(screen.getByText('Select'));
    const weeklyOption = screen.getByText('Weekly');
    fireEvent.click(weeklyOption);
    
    // Reopen dropdown to check highlighting
    fireEvent.click(screen.getByText('Weekly'));
    
    const weeklyButtons = screen.getAllByText('Weekly');
    // The second one should be the highlighted dropdown option
    const weeklyDropdownButton = weeklyButtons[1].closest('button');
    expect(weeklyDropdownButton).toHaveClass('bg-blue-500', 'text-black');
  });

  it('maintains proper z-index for dropdown', () => {
    const { container } = render(<HabitModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Select'));
    
    const dropdown = container.querySelector('.z-10');
    expect(dropdown).toBeInTheDocument();
  });
});
