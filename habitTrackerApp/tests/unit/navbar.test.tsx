import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar, NavbarProps } from '../../src/app/components/navbar';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock Lucide React icons with proper conditional rendering
jest.mock('lucide-react', () => ({
  Menu: ({ 'data-testid': testId, ...props }: any) => (
    <div data-testid="menu-icon" {...props}>☰</div>
  ),
  X: ({ 'data-testid': testId, ...props }: any) => (
    <div data-testid="x-icon" {...props}>X</div>
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe('Navbar Component', () => {
  const defaultProps: NavbarProps = {
    url: 'Habit Tracker',
    title: 'Your Personal Journey',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  it('renders desktop navigation with correct title and url', () => {
    render(<Navbar {...defaultProps} />);
    
    // Fix: Use getAllByText since "Habit Tracker" appears in both desktop and mobile
    const habitTrackerElements = screen.getAllByText('Habit Tracker');
    expect(habitTrackerElements.length).toBe(2); // Desktop + Mobile
    
    expect(screen.getByText('Your Personal Journey')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar {...defaultProps} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Habits')).toBeInTheDocument();
    expect(screen.getByText('Calendar')).toBeInTheDocument();
    expect(screen.getByText('Journaling')).toBeInTheDocument();
  });

  it('has correct href attributes for navigation links', () => {
    render(<Navbar {...defaultProps} />);
    
    const dashboardLinks = screen.getAllByText('Dashboard');
    expect(dashboardLinks[0].closest('a')).toHaveAttribute('href', '/dashboard');
    
    const habitsLinks = screen.getAllByText('Habits');
    expect(habitsLinks[0].closest('a')).toHaveAttribute('href', '/habits');
    
    const calendarLinks = screen.getAllByText('Calendar');
    expect(calendarLinks[0].closest('a')).toHaveAttribute('href', '/calendar');
    
    const journalingLinks = screen.getAllByText('Journaling');
    expect(journalingLinks[0].closest('a')).toHaveAttribute('href', '/journaling');
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Navbar {...defaultProps} />);
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    
    // Initially should show Menu icon
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    // Should now show X icon
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();
    
    // Click to close menu
    fireEvent.click(menuButton);
    
    // Should show Menu icon again
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
  });

  it('closes mobile menu when overlay is clicked', () => {
    render(<Navbar {...defaultProps} />);
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton); // Open menu
    
    // Find and click the overlay
    const overlay = document.querySelector('.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
    
    fireEvent.click(overlay!);
    
    // Menu should be closed
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });



  it('prevents body scroll when mobile menu is open', () => {
    render(<Navbar {...defaultProps} />);
    
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    
    // Open menu
    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe('hidden');
    
    // Close menu
    fireEvent.click(menuButton);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('closes mobile menu when a navigation link is clicked', async () => {
    render(<Navbar url="Test" title="Test Title" />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);
    
    // Verify menu is open (menu is visible and x-icon is showing)
    const dashboardLinks = screen.getAllByText('Dashboard');
    expect(dashboardLinks).toHaveLength(2); // Desktop and mobile versions
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    
    // Click on the mobile navigation link (second one)
    fireEvent.click(dashboardLinks[1]);
    
    // Wait for state change and check menu is closed
    await waitFor(() => {
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
  });

  it('displays fallback title when url is not provided', () => {
    render(<Navbar url="" title={defaultProps.title} />);
    
    // Should show "Habit Tracker" as fallback in mobile header
    const headers = screen.getAllByText('Habit Tracker');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('has correct responsive classes', () => {
    const { container } = render(<Navbar {...defaultProps} />);
    
    // Desktop nav should be hidden on small screens
    const desktopNav = container.querySelector('.hidden.lg\\:flex');
    expect(desktopNav).toBeInTheDocument();
    
    // Mobile nav container should be visible on small screens
    const mobileNav = container.querySelector('.lg\\:hidden');
    expect(mobileNav).toBeInTheDocument();
  });
});
