'use client';

import { useMotivationalQuotes } from '../../hooks/useMotivationalQuotes';
import React from 'react';

interface QuoteComponentProps {
  type?: 'random' | 'daily' | 'habit-motivation';
  habitName?: string;
  autoFetch?: boolean;
  className?: string;
}

export const QuoteComponent: React.FC<QuoteComponentProps> = ({
  type = 'random',
  habitName,
  autoFetch = true,
  className = ''
}) => {
  const { quote, loading, error, fetchQuote, fetchHabitMotivation, fetchDailyQuote } = useMotivationalQuotes({
    type,
    habitName,
    autoFetch
  });

  const handleNewQuote = () => {
    if (type === 'habit-motivation' && habitName) {
      fetchHabitMotivation(habitName);
    } else if (type === 'daily') {
      fetchDailyQuote();
    } else {
      fetchQuote();
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-6 bg-white rounded-lg shadow-sm ${className}`}>
        <div className="text-gray-500">Loading inspirational quote...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="text-red-600 text-sm">Failed to load quote: {error}</div>
        <button 
          onClick={handleNewQuote}
          className="mt-2 text-red-700 hover:text-red-900 underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={`p-6 bg-gray-50 rounded-lg ${className}`}>
        <button 
          onClick={handleNewQuote}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Load a motivational quote
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm ${className}`}>
      <blockquote className="text-gray-800 text-lg italic mb-4">
        "{quote.quote}"
      </blockquote>
      <div className="flex justify-between items-center">
        <cite className="text-gray-600 text-sm font-medium">
          — {quote.author}
        </cite>
        <button
          onClick={handleNewQuote}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
        >
          New Quote
        </button>
      </div>
      {quote.category && (
        <div className="mt-2 text-xs text-gray-500 capitalize">
          {quote.category}
        </div>
      )}
    </div>
  );
};