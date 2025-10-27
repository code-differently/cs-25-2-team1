import { ZenQuoteRaw, ZenQuotesService } from '../../src/lib/services/zenQuotesService';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('ZenQuotesService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getRandomQuote', () => {
    it('should return a formatted quote on successful API call', async () => {
      const mockApiResponse: ZenQuoteRaw[] = [{
        q: 'Test quote',
        a: 'Test Author',
        h: '<p>Test quote</p>'
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await ZenQuotesService.getRandomQuote();

      expect(result).toEqual({
        quote: 'Test quote',
        author: 'Test Author',
        category: 'inspirational'
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://zenquotes.io/api/random',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object)
        })
      );
    });

    it('should handle API error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const result = await ZenQuotesService.getRandomQuote();

      expect(result).toEqual({
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: 'fallback'
      });
    });

    it('should handle network error gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await ZenQuotesService.getRandomQuote();

      expect(result).toEqual({
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: 'fallback'
      });
    });

    it('should handle empty API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const result = await ZenQuotesService.getRandomQuote();

      expect(result).toEqual({
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: 'fallback'
      });
    });
  });

  describe('getTodayQuote', () => {
    it('should return today\'s quote on successful API call', async () => {
      const mockApiResponse: ZenQuoteRaw[] = [{
        q: 'Today\'s quote',
        a: 'Today\'s Author',
        h: '<p>Today\'s quote</p>'
      }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await ZenQuotesService.getTodayQuote();

      expect(result).toEqual({
        quote: 'Today\'s quote',
        author: 'Today\'s Author',
        category: 'daily'
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://zenquotes.io/api/today',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should fallback to default quote on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API error'));

      const result = await ZenQuotesService.getTodayQuote();

      expect(result).toEqual({
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: 'fallback'
      });
    });
  });

  describe('getMultipleQuotes', () => {
    it('should return multiple quotes', async () => {
      const mockApiResponse: ZenQuoteRaw[] = [
        {
          q: 'Test quote',
          a: 'Test Author',
          h: '<p>Test quote</p>'
        }
      ];

      // Mock multiple successful responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        } as Response);

      const result = await ZenQuotesService.getMultipleQuotes(2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        quote: 'Test quote',
        author: 'Test Author',
        category: 'inspirational'
      });
    });

    it('should return fallback on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await ZenQuotesService.getMultipleQuotes(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: 'fallback'
      });
    });
  });
});