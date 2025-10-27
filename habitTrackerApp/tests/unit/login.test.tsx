// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useSignIn: () => ({
    isLoaded: true,
    signIn: {
      create: jest.fn(),
      prepareFirstFactor: jest.fn(),
      attemptFirstFactor: jest.fn()
    },
    setActive: jest.fn()
  }),
  useUser: () => ({
    isSignedIn: false,
    user: null,
    isLoaded: true
  }),
  SignIn: ({ afterSignInUrl }: any) => (
    <div data-testid="clerk-signin">
      Mock Sign In Component
      <div data-testid="redirect-url">{afterSignInUrl}</div>
    </div>
  )
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

import { render, screen } from '@testing-library/react';
import LoginPage from '../../src/app/login/page';

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login page', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('should render login form elements', () => {
    render(<LoginPage />);
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should display Streakr branding', () => {
    render(<LoginPage />);
    
    // Use getAllByText since "Streakr" appears multiple times
    const streakrElements = screen.getAllByText('Streakr');
    expect(streakrElements.length).toBeGreaterThan(0);
  });

  it('should display welcome message', () => {
    render(<LoginPage />);
    
    // Use getAllByText since "Welcome back" appears multiple times
    const welcomeElements = screen.getAllByText(/welcome back/i);
    expect(welcomeElements.length).toBeGreaterThan(0);
  });
});