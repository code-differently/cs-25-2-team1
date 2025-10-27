
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutButton from '../../src/app/components/logout-button';

// Create accessible mocks
const mockSignOut = jest.fn().mockResolvedValue({});
const mockGetSession = jest.fn().mockResolvedValue({ data: { session: { user: { id: '123' } } } });
const mockPush = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: mockGetSession,
      signOut: mockSignOut
    }
  })
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    mockGetSession.mockClear();
    mockPush.mockClear();
  });

  it('renders the button when user is present', async () => {
    render(<LogoutButton />);
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('calls signOut and redirects on click', async () => {
    render(<LogoutButton />);
    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
