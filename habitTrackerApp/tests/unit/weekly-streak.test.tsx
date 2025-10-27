import { render, screen } from '@testing-library/react';
import WeeklyStreak from '../../src/app/components/weekly-streak';

describe('WeeklyStreak Component', () => {
  // Provide a mock habits array with one daily habit completed for today
  const todayIdx = new Date().getDay();
  const mockHabits = [
    {
      id: '1',
      name: 'Test Habit',
      icon: '🔥',
      interval: 'Daily',
      completed: true,
    },
  ];

  it('renders the weekly streak title', () => {
    render(<WeeklyStreak habits={mockHabits} />);
    expect(screen.getByText('Weekly streak')).toBeInTheDocument();
  });

  it('displays all days of the week', () => {
    render(<WeeklyStreak habits={mockHabits} />);
    const expectedDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
    expectedDays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders correct number of day elements', () => {
    render(<WeeklyStreak habits={mockHabits} />);
    const dayLabels = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
    dayLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('has correct styling structure', () => {
    const { container } = render(<WeeklyStreak habits={mockHabits} />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center', 'bg-white', 'rounded-3xl');
    const daysContainer = container.querySelector('.flex.items-center.gap-2');
    expect(daysContainer).toBeInTheDocument();
  });

  it('displays completed and incomplete days with different styling', () => {
    const { container } = render(<WeeklyStreak habits={mockHabits} />);
    const dayPills = container.querySelectorAll('[class*="rounded-full"][class*="h-20"]');
    expect(dayPills).toHaveLength(7);
    const completedPills = container.querySelectorAll('.bg-indigo-700');
    const incompletePills = container.querySelectorAll('.bg-white.border-2.border-indigo-700');
    // Only today should be completed, rest incomplete
    expect(completedPills.length).toBe(1);
    expect(incompletePills.length).toBe(6);
    expect(completedPills.length + incompletePills.length).toBe(7);
  });

  it('has responsive sizing classes', () => {
    const { container } = render(<WeeklyStreak habits={mockHabits} />);
    const dayPill = container.querySelector('[class*="w-10"][class*="sm:w-12"][class*="lg:w-14"]');
    expect(dayPill).toBeInTheDocument();
    const heightClasses = container.querySelector('[class*="h-20"][class*="sm:h-28"][class*="lg:h-32"]');
    expect(heightClasses).toBeInTheDocument();
  });

  it('has proper gap spacing between elements', () => {
    const { container } = render(<WeeklyStreak habits={mockHabits} />);
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('gap-4');
    // Find the days container by its flex and items-center classes
    const daysContainer = Array.from(container.querySelectorAll('div')).find(
      div => div.classList && div.classList.contains('flex') && div.classList.contains('items-center') && div.classList.contains('gap-2')
    );
    expect(daysContainer).toBeInTheDocument();
    // Check for responsive gap classes
    expect(daysContainer?.className).toMatch(/gap-2/);
    expect(daysContainer?.className).toMatch(/sm:gap-4/);
    expect(daysContainer?.className).toMatch(/lg:gap-8/);
  });
 
});
