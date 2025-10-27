// Mock global fetch
global.fetch = jest.fn();

import {
    exchangeCodeForTokens,
    getGoogleAuthUrl,
    GOOGLE_OAUTH_CONFIG,
    refreshGoogleToken
} from '../../src/lib/google-auth';

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Google Auth Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback';
  });

  afterEach(() => {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REDIRECT_URI;
  });

  describe('exchangeCodeForTokens', () => {
    it('should successfully exchange code for tokens', async () => {
      const mockResponse = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-123',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'https://www.googleapis.com/auth/calendar'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await exchangeCodeForTokens('auth-code-123');

      expect(fetch).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expect.stringContaining('code=auth-code-123'),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when exchange fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response);

      await expect(exchangeCodeForTokens('invalid-code')).rejects.toThrow(
        'Failed to exchange code for tokens: 400 Bad Request'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(exchangeCodeForTokens('auth-code-123')).rejects.toThrow('Network error');
    });
  });

  describe('refreshGoogleToken', () => {
    it('should successfully refresh access token', async () => {
      const mockResponse = {
        access_token: 'new-access-token-123',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'https://www.googleapis.com/auth/calendar'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await refreshGoogleToken('refresh-token-123');

      expect(fetch).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expect.stringContaining('refresh_token=refresh-token-123'),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when refresh fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response);

      await expect(refreshGoogleToken('invalid-refresh-token')).rejects.toThrow(
        'Failed to refresh token'
      );
    });
  });

  describe('getGoogleAuthUrl', () => {
    it('should generate correct Google auth URL', () => {
      const url = getGoogleAuthUrl();
      
      expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('redirect_uri=');
      expect(url).toContain('response_type=code');
      expect(url).toContain('access_type=offline');
      expect(url).toContain('prompt=consent');
      expect(url).toContain('scope=');
    });

    it('should include all required scopes', () => {
      const url = getGoogleAuthUrl();
      
      expect(url).toContain('https://www.googleapis.com/auth/calendar');
      expect(url).toContain('https://www.googleapis.com/auth/calendar.events');
      expect(url).toContain('openid');
      expect(url).toContain('profile');
      expect(url).toContain('email');
    });
  });

  describe('GOOGLE_OAUTH_CONFIG', () => {
    it('should have correct configuration structure', () => {
      expect(GOOGLE_OAUTH_CONFIG).toHaveProperty('clientId');
      expect(GOOGLE_OAUTH_CONFIG).toHaveProperty('clientSecret');
      expect(GOOGLE_OAUTH_CONFIG).toHaveProperty('redirectUri');
      expect(GOOGLE_OAUTH_CONFIG).toHaveProperty('scopes');
      expect(Array.isArray(GOOGLE_OAUTH_CONFIG.scopes)).toBe(true);
    });
  });

  describe('Environment Variables', () => {
    it('should handle missing environment variables', async () => {
      delete process.env.GOOGLE_CLIENT_ID;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      } as Response);

      // The function should still work but with undefined client_id
      await exchangeCodeForTokens('code-123');

      expect(fetch).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: expect.stringContaining('client_id=undefined'),
      });
    });
  });
});