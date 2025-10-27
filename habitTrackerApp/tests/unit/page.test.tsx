// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn()
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

import { useUser } from '@clerk/nextjs';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomePage from '../../src/app/page';

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockPush = jest.fn();
const mockRouter = { push: mockPush, replace: jest.fn() };

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render loading screen when user data is not loaded', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false
    } as any);

    render(<HomePage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should redirect to dashboard when user is authenticated', () => {
    mockUseUser.mockReturnValue({
      user: { id: 'user-123' } as any,
      isLoaded: true,
      isSignedIn: true
    });

    render(<HomePage />);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
      isSignedIn: false
    });

    render(<HomePage />);
    
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should have proper styling classes', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false
    } as any);

    const { container } = render(<HomePage />);
    
    expect(container.firstChild).toHaveClass('min-h-screen', 'bg-gray-100', 'flex', 'items-center', 'justify-center');
  });

  it('should show loading spinner with proper animation', () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
      isSignedIn: false
    } as any);

    render(<HomePage />);
    
    const spinner = screen.getByRole('status').firstChild;
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-b-2', 'border-[#5B4CCC]');
  });
});