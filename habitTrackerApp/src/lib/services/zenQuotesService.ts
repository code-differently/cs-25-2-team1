// ZenQuotes API integration service

export interface ZenQuoteRaw {
  q: string; // quote text
  a: string; // author
  h: string; // HTML formatted quote
}

export interface ZenQuoteResponse {
  quote: string;
  author: string;
  category?: string;
}

export class ZenQuotesService {
  private static readonly BASE_URL = 'https://zenquotes.io/api';
  private static readonly ENDPOINTS = {
    random: '/random',
    today: '/today',
    quotes: '/quotes'
  };

  /**
   * Get a random inspirational quote
   */
  static async getRandomQuote(): Promise<ZenQuoteResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.random}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HabitTracker/1.0'
        },
      });

      if (!response.ok) {
        throw new Error(`ZenQuotes API error: ${response.status}`);
      }

      const data: ZenQuoteRaw[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No quote received from ZenQuotes API');
      }

      const zenQuote = data[0];
      
      return {
        quote: zenQuote.q,
        author: zenQuote.a,
        category: 'inspirational'
      };
    } catch (error) {
      console.error('Error fetching quote from ZenQuotes:', error);
      
      // Fallback quote if API fails
      return {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        category: 'fallback'
      };
    }
  }

  /**
   * Get quote of the day
   */
  static async getTodayQuote(): Promise<ZenQuoteResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.today}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HabitTracker/1.0'
        },
      });

      if (!response.ok) {
        throw new Error(`ZenQuotes API error: ${response.status}`);
      }

      const data: ZenQuoteRaw[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error('No quote received from ZenQuotes API');
      }

      const zenQuote = data[0];
      
      return {
        quote: zenQuote.q,
        author: zenQuote.a,
        category: 'daily'
      };
    } catch (error) {
      console.error('Error fetching daily quote from ZenQuotes:', error);
      
      // Fallback quote if API fails
      return {
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        category: 'fallback'
      };
    }
  }

  /**
   * Get multiple quotes for variety
   */
  static async getMultipleQuotes(count: number = 5): Promise<ZenQuoteResponse[]> {
    try {
      const quotes: ZenQuoteResponse[] = [];
      
      // ZenQuotes free tier doesn't support bulk requests, so we'll call random multiple times
      for (let i = 0; i < Math.min(count, 5); i++) {
        const quote = await this.getRandomQuote();
        quotes.push(quote);
        
        // Small delay to respect rate limits
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      return quotes;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      return [{
        quote: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
        category: 'fallback'
      }];
    }
  }

  /**
   * Get a habit-specific motivational quote
   */
  static async getHabitMotivation(habitName?: string): Promise<ZenQuoteResponse> {
    // For now, just return a random quote
    // In the future, you could filter by habit type or use different quote sources
    const quote = await this.getRandomQuote();
    
    return {
      ...quote,
      category: 'habit-motivation'
    };
  }
}