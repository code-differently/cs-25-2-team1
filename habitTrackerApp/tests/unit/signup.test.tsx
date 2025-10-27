// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useSignUp: () => ({
    isLoaded: true,
    signUp: {
      create: jest.fn(),
      prepareEmailAddressVerification: jest.fn(),
      attemptEmailAddressVerification: jest.fn()
    },
    setActive: jest.fn()
  }),
  SignUp: ({ afterSignUpUrl }: any) => (
    <div data-testid="clerk-signup">
      Mock Sign Up Component
      <div data-testid="redirect-url">{afterSignUpUrl}</div>
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
import SignUpPage from '../../src/app/signup/page';

describe('SignUp Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the signup page', () => {
    render(<SignUpPage />);
    
    // Use getAllByText since "Sign Up" appears in both heading and button
    const signUpElements = screen.getAllByText(/sign up/i);
    expect(signUpElements.length).toBeGreaterThan(0);
  });

  it('should render signup form elements', () => {
    render(<SignUpPage />);
    
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('should render social login options', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('should display signup message', () => {
    render(<SignUpPage />);
    
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
  });
});