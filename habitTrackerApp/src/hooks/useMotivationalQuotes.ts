'use client';

import type { APIResponse, MotivationalQuote } from '../types/api';
import { useCallback, useEffect, useState } from 'react';

interface UseMotivationalQuotesOptions {
  type?: 'random' | 'daily' | 'multiple' | 'habit-motivation';
  count?: number;
  habitName?: string;
  autoFetch?: boolean;
}

interface UseMotivationalQuotesReturn {
  quote: MotivationalQuote | null;
  quotes: MotivationalQuote[];
  loading: boolean;
  error: string | null;
  fetchQuote: () => Promise<void>;
  fetchMultipleQuotes: (count: number) => Promise<void>;
  fetchHabitMotivation: (habitName: string) => Promise<void>;
  fetchDailyQuote: () => Promise<void>;
}

export function useMotivationalQuotes(
  options: UseMotivationalQuotesOptions = {}
): UseMotivationalQuotesReturn {
  const { type = 'random', count = 1, habitName, autoFetch = false } = options;
  
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [quotes, setQuotes] = useState<MotivationalQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/integrations/quotes?type=${type}`);
      const data: APIResponse<MotivationalQuote> = await response.json();

      if (data.success && data.data) {
        setQuote(data.data as MotivationalQuote);
      } else {
        setError(data.error || 'Failed to fetch quote');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const fetchMultipleQuotes = useCallback(async (fetchCount: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/integrations/quotes?type=multiple&count=${fetchCount}`);
      const data: APIResponse<MotivationalQuote[]> = await response.json();

      if (data.success && data.data) {
        setQuotes(data.data as MotivationalQuote[]);
      } else {
        setError(data.error || 'Failed to fetch quotes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHabitMotivation = useCallback(async (habitName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/integrations/quotes?type=habit-motivation&habit_name=${encodeURIComponent(habitName)}`);
      const data: APIResponse<MotivationalQuote> = await response.json();

      if (data.success && data.data) {
        setQuote(data.data as MotivationalQuote);
      } else {
        setError(data.error || 'Failed to fetch habit motivation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDailyQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/integrations/quotes?type=daily');
      const data: APIResponse<MotivationalQuote> = await response.json();

      if (data.success && data.data) {
        setQuote(data.data as MotivationalQuote);
      } else {
        setError(data.error || 'Failed to fetch daily quote');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      if (type === 'multiple') {
        fetchMultipleQuotes(count);
      } else if (type === 'habit-motivation' && habitName) {
        fetchHabitMotivation(habitName);
      } else if (type === 'daily') {
        fetchDailyQuote();
      } else {
        fetchQuote();
      }
    }
  }, [autoFetch, type, count, habitName, fetchQuote, fetchMultipleQuotes, fetchHabitMotivation, fetchDailyQuote]);

  return {
    quote,
    quotes,
    loading,
    error,
    fetchQuote,
    fetchMultipleQuotes,
    fetchHabitMotivation,
    fetchDailyQuote,
  };
}