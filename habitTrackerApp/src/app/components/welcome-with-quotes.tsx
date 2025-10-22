// Example integration of ZenQuotes into your existing Welcome component
// This shows how you can add motivational quotes to your habit tracker

'use client';

import React from 'react';
import { QuoteComponent } from './quote-component';

interface WelcomeWithQuotesProps {
  userName?: string;
  className?: string;
  onAddHabit?: () => void;
}

export const WelcomeWithQuotes: React.FC<WelcomeWithQuotesProps> = ({ 
  userName = "Jane", 
  className = "", 
  onAddHabit 
}) => {
  return (
    <div className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 gap-4 ${className}`}>
      {/* Existing Welcome Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-normal text-black">
          Welcome in, <span className="font-semibold">{userName}</span>
        </h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button 
            onClick={onAddHabit}
            className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 text-white text-sm sm:text-base font-medium bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
          >
            Add Habit
          </button>
          
          <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 text-indigo-700 text-sm sm:text-base font-medium bg-white border-2 border-indigo-700 rounded-full hover:bg-indigo-50 transition-colors">
            Journal
          </button>
        </div>
      </div>

      {/* NEW: Daily Motivational Quote Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-800 mb-3">Daily Inspiration</h2>
        <QuoteComponent 
          type="daily" 
          autoFetch={true}
          className="max-w-2xl"
        />
      </div>
    </div>
  );
};