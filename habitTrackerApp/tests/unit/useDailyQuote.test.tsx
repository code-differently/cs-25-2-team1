import * as React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { useDailyQuote } from '../../src/hooks/useDailyQuote';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function TestComponent() {
  const { quote, loading, error, refreshQuote } = useDailyQuote();
  return (
    <div>
      <div data-testid="quote">{quote ? quote.quote : ''}</div>
      <div data-testid="author">{quote ? quote.author : ''}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error || ''}</div>
      <button onClick={refreshQuote}>Refresh</button>
    </div>
  );
}

describe('useDailyQuote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('returns cached quote if available and date matches', async () => {
    const today = new Date().toISOString().split('T')[0];
    const cachedQuote = { quote: 'Cached quote', author: 'Test', category: 'motivation', source: 'test' };
    localStorage.setItem('daily_quote_date', today);
    localStorage.setItem('daily_quote', JSON.stringify(cachedQuote));
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('quote').textContent).toBe('Cached quote'));
    expect(screen.getByTestId('author').textContent).toBe('Test');
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('fetches quote from API if no cache, caches it, and returns it', async () => {
    const apiQuote = { quote: 'API quote', author: 'API', category: 'motivation', source: 'api' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: apiQuote })
    }) as any;
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('quote').textContent).toBe('API quote'));
    expect(localStorage.setItem).toHaveBeenCalledWith('daily_quote', JSON.stringify(apiQuote));
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('uses fallback quote if API fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as any;
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('quote').textContent).not.toBe(''));
    expect(screen.getByTestId('author').textContent).not.toBe('');
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('quote').textContent).not.toBe('API quote');
  });

  it('refreshQuote clears cache and fetches new quote', async () => {
    const apiQuote = { quote: 'New quote', author: 'API', category: 'motivation', source: 'api' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: apiQuote })
    }) as any;
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('quote').textContent).not.toBe(''));
    await act(async () => {
      screen.getByText('Refresh').click();
    });
    await waitFor(() => expect(screen.getByTestId('quote').textContent).toBe('New quote'));
    expect(localStorage.removeItem).toHaveBeenCalledWith('daily_quote');
    expect(localStorage.removeItem).toHaveBeenCalledWith('daily_quote_date');
  });

  it('handles localStorage errors gracefully', async () => {
    localStorage.getItem = jest.fn(() => { throw new Error('fail'); });
    const apiQuote = { quote: 'API quote', author: 'API', category: 'motivation', source: 'api' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: apiQuote })
    }) as any;
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId('quote').textContent).toBe('API quote'));
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('');
  });
});
