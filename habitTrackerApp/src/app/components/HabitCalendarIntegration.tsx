'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

interface HabitCalendarIntegrationProps {
  user: User;
  habitId: string;
  habitName: string;
  isGoogleConnected: boolean;
}

export default function HabitCalendarIntegration({ 
  user, 
  habitId, 
  habitName, 
  isGoogleConnected 
}: HabitCalendarIntegrationProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const supabase = createClientComponentClient();

  const createCalendarReminder = async () => {
    if (!isGoogleConnected) {
      alert('Please connect your Google Calendar first');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/calendar/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitId,
          title: `${habitName} - Habit Reminder`,
          description: `Time to work on your habit: ${habitName}`,
          dateTime: new Date().toISOString(), // You can customize this
          recurrence: ['RRULE:FREQ=DAILY'], // Daily reminder
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setHasReminder(true);
        alert('Calendar reminder created successfully!');
      } else {
        throw new Error('Failed to create calendar reminder');
      }
    } catch (error) {
      console.error('Error creating calendar reminder:', error);
      alert('Failed to create calendar reminder. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isGoogleConnected) {
    return (
      <div className="text-sm text-gray-500 italic">
        Connect Google Calendar to create reminders
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {hasReminder ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          📅 Calendar reminder active
        </span>
      ) : (
        <button
          onClick={createCalendarReminder}
          disabled={isCreating}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isCreating ? (
            <>
              <div className="animate-spin -ml-1 mr-2 h-3 w-3 border border-blue-700 rounded-full border-t-transparent"></div>
              Creating...
            </>
          ) : (
            <>
              📅 Add Calendar Reminder
            </>
          )}
        </button>
      )}
    </div>
  );
}