import { useState, useEffect, useCallback } from 'react';
import { MotivationalQuote } from '../types/api';

interface QuoteState {
  quote: MotivationalQuote | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'daily_quote';
const DATE_KEY = 'daily_quote_date';

// Fallback quotes in case API fails
const fallbackQuotes: MotivationalQuote[] = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
    source: "fallback"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "motivation", 
    source: "fallback"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "inspirational",
    source: "fallback"
  },
  {
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "motivation",
    source: "fallback"
  },
  {
    quote: "Your limitation—it's only your imagination.",
    author: "Unknown",
    category: "motivation",
    source: "fallback"
  },
  {
    quote: "The greatest glory in living lies not in never falling, but in rising every time we fall. We must accept finite disappointment, but never lose infinite hope because the future belongs to those who believe in the beauty of their dreams and work towards making them reality.",
    author: "Nelson Mandela & Martin Luther King Jr.",
    category: "inspirational",
    source: "fallback"
  }
];

export const useDailyQuote = () => {
  const [state, setState] = useState<QuoteState>({
    quote: null,
    loading: true,
    error: null
  });

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getCachedQuote = (): MotivationalQuote | null => {
    try {
      const cachedDate = localStorage.getItem(DATE_KEY);
      const cachedQuote = localStorage.getItem(STORAGE_KEY);
      
      if (cachedDate === getTodayString() && cachedQuote) {
        return JSON.parse(cachedQuote);
      }
    } catch (error) {
      console.error('Error reading cached quote:', error);
    }
    return null;
  };

  const cacheQuote = (quote: MotivationalQuote) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
      localStorage.setItem(DATE_KEY, getTodayString());
    } catch (error) {
      console.error('Error caching quote:', error);
    }
  };

  const getRandomFallbackQuote = (): MotivationalQuote => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return {
      ...fallbackQuotes[randomIndex],
      timestamp: new Date().toISOString()
    };
  };

  const fetchDailyQuote = async (): Promise<MotivationalQuote> => {
    const response = await fetch('/api/integrations/quotes?type=daily');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error('Invalid API response');
    }
    
    return data.data as MotivationalQuote;
  };

  const loadQuote = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    // First, try to get cached quote
    const cachedQuote = getCachedQuote();
    if (cachedQuote) {
      setState({
        quote: cachedQuote,
        loading: false,
        error: null
      });
      return;
    }

    // If no cached quote, fetch from API
    try {
      const quote = await fetchDailyQuote();
      cacheQuote(quote);
      setState({
        quote,
        loading: false,
        error: null
      });
    } catch (error) {
      console.warn('Failed to fetch daily quote, using fallback:', error);
      
      // Use fallback quote
      const fallbackQuote = getRandomFallbackQuote();
      cacheQuote(fallbackQuote);
      
      setState({
        quote: fallbackQuote,
        loading: false,
        error: null // Don't show error to user, we have fallback
      });
    }
  };

  const refreshQuote = async () => {
    // Clear cache and fetch new quote
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATE_KEY);
    await loadQuote();
  };

  useEffect(() => {
    loadQuote();
  }, []);

  return {
    quote: state.quote,
    loading: state.loading,
    error: state.error,
    refreshQuote
  };
};
