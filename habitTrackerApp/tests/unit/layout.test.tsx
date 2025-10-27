import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import RootLayout from '../../src/app/layout';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({
    className: 'mocked-inter-font',
  })),
}));

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerk-provider">{children}</div>
  ),
}));

jest.mock('../../src/hooks/useEnsureProfile', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../src/app/components/navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Mock Navbar</nav>,
}));

// Mock CSS import
jest.mock('../../src/app/globals.css', () => ({}));

import { usePathname } from 'next/navigation';
import useEnsureProfile from '../../src/hooks/useEnsureProfile';

const mockUseEnsureProfile = useEnsureProfile as jest.Mock;

describe('RootLayout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEnsureProfile.mockImplementation(() => {});
  });

  describe('Basic Layout Structure', () => {
    it('should render layout with correct HTML structure', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="test-content">Test Content</div>
        </RootLayout>
      );

      expect(screen.getByRole('document')).toBeInTheDocument();
      expect(screen.getByTestId('clerk-provider')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should apply Inter font class to body', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      const body = document.body;
      expect(body).toHaveClass('mocked-inter-font');
    });

    it('should render children content correctly', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="child-content">
            <h1>Page Title</h1>
            <p>Page content goes here</p>
          </div>
        </RootLayout>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Page content goes here')).toBeInTheDocument();
    });

    it('should wrap content in ClerkProvider', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="content">Content</div>
        </RootLayout>
      );

      const clerkProvider = screen.getByTestId('clerk-provider');
      expect(clerkProvider).toBeInTheDocument();
      expect(clerkProvider).toContainElement(screen.getByTestId('content'));
    });
  });

  describe('Navigation Bar Conditional Rendering', () => {
    it('should show navbar on regular pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Dashboard Content</div>
        </RootLayout>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should show navbar on habits page', () => {
      (usePathname as jest.Mock).mockReturnValue('/habits');

      render(
        <RootLayout>
          <div>Habits Content</div>
        </RootLayout>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should show navbar on journaling page', () => {
      (usePathname as jest.Mock).mockReturnValue('/journaling');

      render(
        <RootLayout>
          <div>Journaling Content</div>
        </RootLayout>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should hide navbar on login page', () => {
      (usePathname as jest.Mock).mockReturnValue('/login');

      render(
        <RootLayout>
          <div>Login Content</div>
        </RootLayout>
      );

      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    });

    it('should hide navbar on signup page', () => {
      (usePathname as jest.Mock).mockReturnValue('/signup');

      render(
        <RootLayout>
          <div>Signup Content</div>
        </RootLayout>
      );

      expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
    });

    it('should show navbar on root path', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(
        <RootLayout>
          <div>Home Content</div>
        </RootLayout>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Main Content Styling', () => {
    it('should apply correct styles when navbar is shown', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="content">Dashboard Content</div>
        </RootLayout>
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('flex-1', 'lg:ml-64', 'pt-16', 'lg:pt-0');
    });

    it('should apply different styles when navbar is hidden', () => {
      (usePathname as jest.Mock).mockReturnValue('/login');

      render(
        <RootLayout>
          <div data-testid="content">Login Content</div>
        </RootLayout>
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('flex-1');
      expect(mainElement).not.toHaveClass('lg:ml-64');
      expect(mainElement).not.toHaveClass('pt-16');
      expect(mainElement).not.toHaveClass('lg:pt-0');
    });

    it('should have responsive margin and padding classes with navbar', () => {
      (usePathname as jest.Mock).mockReturnValue('/habits');

      render(
        <RootLayout>
          <div>Habits Content</div>
        </RootLayout>
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toHaveClass('lg:ml-64'); // Large screen left margin
      expect(mainElement).toHaveClass('pt-16'); // Top padding for mobile
      expect(mainElement).toHaveClass('lg:pt-0'); // No top padding on large screens
    });
  });

  describe('Layout Container Structure', () => {
    it('should have proper flex layout structure', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      const flexContainer = screen.getByRole('main').parentElement;
      expect(flexContainer).toHaveClass('flex', 'min-h-screen');
    });

    it('should render main element with correct role', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="content">Main Content</div>
        </RootLayout>
      );

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toContainElement(screen.getByTestId('content'));
    });
  });

  describe('Hook Integration', () => {
    it('should call useEnsureProfile hook', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(mockUseEnsureProfile).toHaveBeenCalledTimes(1);
    });

    it('should call usePathname hook', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(usePathname).toHaveBeenCalledTimes(1);
    });

    it('should handle useEnsureProfile errors gracefully', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockUseEnsureProfile.mockImplementation(() => {
        throw new Error('Profile hook error');
      });

      expect(() => {
        render(
          <RootLayout>
            <div>Content</div>
          </RootLayout>
        );
      }).toThrow('Profile hook error');
    });
  });

  describe('HTML Document Structure', () => {
    it('should render html element with lang attribute', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('should render body with correct font class', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>
      );

      expect(document.body).toHaveClass('mocked-inter-font');
    });
  });

  describe('Edge Cases and Path Variations', () => {
    it('should handle nested login paths', () => {
      (usePathname as jest.Mock).mockReturnValue('/auth/login');

      render(
        <RootLayout>
          <div>Nested Login</div>
        </RootLayout>
      );

      // Should still show navbar for paths that are not exactly /login or /signup
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should handle paths with query parameters', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard?tab=habits');

      render(
        <RootLayout>
          <div>Dashboard with Query</div>
        </RootLayout>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should handle undefined pathname gracefully', () => {
      (usePathname as jest.Mock).mockReturnValue(undefined);

      render(
        <RootLayout>
          <div>Content with undefined path</div>
        </RootLayout>
      );

      // Should default to showing navbar
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should handle empty string pathname', () => {
      (usePathname as jest.Mock).mockReturnValue('');

      render(
        <RootLayout>
          <div>Content with empty path</div>
        </RootLayout>
      );

      // Should show navbar for empty path
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
  });

  describe('Multiple Children Rendering', () => {
    it('should render multiple children correctly', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <div data-testid="child-3">Third Child</div>
        </RootLayout>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render complex nested children', () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');

      render(
        <RootLayout>
          <div data-testid="parent">
            <div data-testid="nested-child-1">
              <span>Deeply nested content</span>
            </div>
            <div data-testid="nested-child-2">
              <button>Action Button</button>
            </div>
          </div>
        </RootLayout>
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('nested-child-2')).toBeInTheDocument();
      expect(screen.getByText('Deeply nested content')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });
  });
});