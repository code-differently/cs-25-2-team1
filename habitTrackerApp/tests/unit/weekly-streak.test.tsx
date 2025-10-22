import { render, screen } from '@testing-library/react';
import WeeklyStreak from '../../src/app/components/weekly-streak';

describe('WeeklyStreak Component', () => {
  it('renders the weekly streak title', () => {
    render(<WeeklyStreak />);
    
    expect(screen.getByText('Weekly streak')).toBeInTheDocument();
  });

  it('displays all days of the week', () => {
    render(<WeeklyStreak />);
    
    const expectedDays = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
    
    expectedDays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders correct number of day elements', () => {
    render(<WeeklyStreak />);
    
    // Should have 7 days
    const dayLabels = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
    dayLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('has correct styling structure', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Main container should have correct classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center', 'bg-white', 'rounded-3xl');
    
    // Days container should exist
    const daysContainer = container.querySelector('.flex.items-center.gap-2');
    expect(daysContainer).toBeInTheDocument();
  });

  it('displays completed and incomplete days with different styling', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Get all day pill elements (rounded elements that represent days)
    const dayPills = container.querySelectorAll('[class*="rounded-full"][class*="h-20"]');
    expect(dayPills).toHaveLength(7);
    
    // Check that some have completed styling (bg-indigo-700) and some have incomplete styling
    const completedPills = container.querySelectorAll('.bg-indigo-700');
    const incompletePills = container.querySelectorAll('.bg-white.border-2.border-indigo-700');
    
    expect(completedPills.length).toBeGreaterThan(0);
    expect(incompletePills.length).toBeGreaterThan(0);
    expect(completedPills.length + incompletePills.length).toBe(7);
  });

  it('has responsive sizing classes', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Check for responsive classes on day pills
    const dayPill = container.querySelector('[class*="w-10"][class*="sm:w-12"][class*="lg:w-14"]');
    expect(dayPill).toBeInTheDocument();
    
    const heightClasses = container.querySelector('[class*="h-20"][class*="sm:h-28"][class*="lg:h-32"]');
    expect(heightClasses).toBeInTheDocument();
  });

  it('has proper gap spacing between elements', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Main container gap
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('gap-4');
    
    // Days container gap
    const daysContainer = container.querySelector('.gap-2.sm\\:gap-4.lg\\:gap-8');
    expect(daysContainer).toBeInTheDocument();
  });

  it('renders with correct accessibility structure', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Should have proper heading structure
    const heading = screen.getByText('Weekly streak');
    expect(heading.tagName).toBe('H2');
    
    // Should have scrollable container for responsive design
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('has consistent day label styling', () => {
    const { container } = render(<WeeklyStreak />);
    
    // All day labels should have consistent styling
    const dayLabels = container.querySelectorAll('.text-xs.sm\\:text-sm.font-medium.text-black');
    expect(dayLabels).toHaveLength(7);
  });

  it('maintains proper flex layout', () => {
    const { container } = render(<WeeklyStreak />);
    
    // Each day should be in a flex column layout
    const dayContainers = container.querySelectorAll('.flex.flex-col.items-center.gap-2.flex-shrink-0');
    expect(dayContainers).toHaveLength(7);
  });

  it('renders with shadow and proper background', () => {
    const { container } = render(<WeeklyStreak />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('bg-white', 'rounded-3xl', 'shadow-sm');
  });
});
