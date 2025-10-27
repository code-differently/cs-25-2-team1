// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: null,
    isLoaded: true
  })
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn()
  })
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

import { render, screen } from '@testing-library/react';
import HomePage from '../../src/app/page';

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading screen', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display loading spinner', () => {
    render(<HomePage />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    render(<HomePage />);
    
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();
  });

  it('should center content properly', () => {
    render(<HomePage />);
    
    const centerDiv = document.querySelector('.flex.items-center.justify-center');
    expect(centerDiv).toBeInTheDocument();
  });
});