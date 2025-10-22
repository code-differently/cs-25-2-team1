import { render, screen, fireEvent } from '@testing-library/react';
import TasksAndReminders from '../../src/app/components/tasks-and-reminders';

describe('TasksAndReminders Component (with Mood Tracker)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders mood tracker and reminders sections', () => {
    render(<TasksAndReminders />);
    
    expect(screen.getByText('Mood')).toBeInTheDocument();
    expect(screen.getByText('Reminders')).toBeInTheDocument();
    expect(screen.getByText('Today I feel...')).toBeInTheDocument();
  });

  it('displays mood selection dropdown when clicked', () => {
    render(<TasksAndReminders />);
    
    const dropdownButton = screen.getByText('Today I feel...');
    fireEvent.click(dropdownButton);
    
    // Check that mood options appear
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Joy')).toBeInTheDocument();
    expect(screen.getByText('Fear')).toBeInTheDocument();
    expect(screen.getByText('Disgust')).toBeInTheDocument();
    expect(screen.getByText('Anger')).toBeInTheDocument();
    expect(screen.getByText('Surprised')).toBeInTheDocument();
    expect(screen.getByText('Anxious')).toBeInTheDocument();
    expect(screen.getByText('Sad')).toBeInTheDocument();
    expect(screen.getByText('Annoyed')).toBeInTheDocument();
  });

  it('selects a mood and displays it correctly', () => {
    render(<TasksAndReminders />);
    
    // Open dropdown
    const dropdownButton = screen.getByText('Today I feel...');
    fireEvent.click(dropdownButton);
    
    // Select Happy mood
    const happyOption = screen.getByText('Happy');
    fireEvent.click(happyOption);
    
    // Should show selected mood
    expect(screen.getByText('Today I feel happy')).toBeInTheDocument();
    expect(screen.getByText('Change mood')).toBeInTheDocument();
    
    // Dropdown should be closed
    expect(screen.queryByText('Joy')).not.toBeInTheDocument();
  });

  it('allows changing mood after selection', () => {
    render(<TasksAndReminders />);
    
    // Select a mood first
    fireEvent.click(screen.getByText('Today I feel...'));
    fireEvent.click(screen.getByText('Sad'));
    
    expect(screen.getByText('Today I feel sad')).toBeInTheDocument();
    
    // Click change mood
    fireEvent.click(screen.getByText('Change mood'));
    
    // Should be back to initial state
    expect(screen.getByText('Today I feel...')).toBeInTheDocument();
    expect(screen.queryByText('Today I feel sad')).not.toBeInTheDocument();
  });

  it('toggles dropdown arrow correctly', () => {
    render(<TasksAndReminders />);
    
    const dropdownButton = screen.getByText('Today I feel...').closest('button');
    
    // Initially should show down arrow
    expect(dropdownButton).toHaveTextContent('∨');
    
    // Click to open
    fireEvent.click(dropdownButton!);
    expect(dropdownButton).toHaveTextContent('∧');
    
    // Click to close
    fireEvent.click(dropdownButton!);
    expect(dropdownButton).toHaveTextContent('∨');
  });

  it('closes dropdown when mood is selected', () => {
    render(<TasksAndReminders />);
    
    // Open dropdown
    fireEvent.click(screen.getByText('Today I feel...'));
    
    // Verify dropdown is open
    expect(screen.getByText('Anger')).toBeInTheDocument();
    
    // Select mood
    fireEvent.click(screen.getByText('Joy'));
    
    // Dropdown should be closed
    expect(screen.queryByText('Anger')).not.toBeInTheDocument();
  });

  it('renders all mood options in dropdown', () => {
    render(<TasksAndReminders />);
    
    fireEvent.click(screen.getByText('Today I feel...'));
    
    const expectedMoods = [
      'Happy', 'Joy', 'Fear', 'Disgust', 'Anger', 
      'Surprised', 'Anxious', 'Sad', 'Annoyed'
    ];
    
    expectedMoods.forEach(mood => {
      expect(screen.getByText(mood)).toBeInTheDocument();
    });
  });

  it('has correct styling for mood card', () => {
    const { container } = render(<TasksAndReminders />);
    
    const moodCard = container.querySelector('.bg-white.border-2.border-gray-300');
    expect(moodCard).toBeInTheDocument();
    expect(moodCard).toHaveClass('rounded-3xl');
  });

  it('has correct styling for reminders card', () => {
    const { container } = render(<TasksAndReminders />);
    
    const reminderCard = container.querySelector('.bg-indigo-700');
    expect(reminderCard).toBeInTheDocument();
    expect(reminderCard).toHaveClass('rounded-3xl');
  });

  it('has responsive classes applied', () => {
    const { container } = render(<TasksAndReminders />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('w-full', 'sm:w-64', 'lg:w-64');
  });

  it('renders SVG icons for selected moods', () => {
    const { container } = render(<TasksAndReminders />);
    
    // Select a mood
    fireEvent.click(screen.getByText('Today I feel...'));
    fireEvent.click(screen.getByText('Happy'));
    
    // Should render SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 100 100');
  });

  it('maintains dropdown accessibility', () => {
    render(<TasksAndReminders />);
    
    const dropdownButton = screen.getByText('Today I feel...').closest('button');
    expect(dropdownButton).toHaveAttribute('type', 'button');
    
    // Open dropdown
    fireEvent.click(dropdownButton!);
    
    // All mood options should be buttons
    const moodButtons = screen.getAllByRole('button');
    const moodOptionButtons = moodButtons.filter(button => 
      ['Happy', 'Joy', 'Fear', 'Disgust', 'Anger', 'Surprised', 'Anxious', 'Sad', 'Annoyed']
        .includes(button.textContent || '')
    );
    
    expect(moodOptionButtons.length).toBe(9);
    moodOptionButtons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
