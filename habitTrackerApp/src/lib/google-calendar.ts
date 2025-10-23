import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  reminders?: {
    useDefault: boolean;
    overrides?: {
      method: string;
      minutes: number;
    }[];
  };
}

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    
    this.calendar = google.calendar({
      version: 'v3',
      auth: auth,
    });
  }

  // Create a habit reminder event
  async createHabitReminder(event: CalendarEvent): Promise<any> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
          reminders: event.reminders || {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 }, // 1 day before
              { method: 'popup', minutes: 30 }, // 30 minutes before
            ],
          },
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  // Get habit-related events
  async getHabitEvents(startDate: string, endDate: string): Promise<any[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate,
        timeMax: endDate,
        q: 'habit', // Search for events containing 'habit'
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Update habit reminder
  async updateHabitReminder(eventId: string, event: Partial<CalendarEvent>): Promise<any> {
    try {
      const response = await this.calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  // Delete habit reminder
  async deleteHabitReminder(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Create recurring habit reminders
  async createRecurringHabitReminder(event: CalendarEvent & { 
    recurrence: string[] 
  }): Promise<any> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.summary,
          description: event.description,
          start: event.start,
          end: event.end,
          recurrence: event.recurrence, // e.g., ['RRULE:FREQ=DAILY']
          reminders: event.reminders,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating recurring event:', error);
      throw error;
    }
  }
}

// Helper function to generate habit reminders based on frequency
export function generateHabitRecurrence(frequency: 'daily' | 'weekly' | 'monthly'): string[] {
  switch (frequency) {
    case 'daily':
      return ['RRULE:FREQ=DAILY'];
    case 'weekly':
      return ['RRULE:FREQ=WEEKLY'];
    case 'monthly':
      return ['RRULE:FREQ=MONTHLY'];
    default:
      return ['RRULE:FREQ=DAILY'];
  }
}

// Helper to create habit reminder from habit data
export function createHabitReminderEvent(
  habitTitle: string,
  habitDescription: string,
  reminderTime: string, // ISO string
  frequency: 'daily' | 'weekly' | 'monthly'
): CalendarEvent & { recurrence: string[] } {
  const startDate = new Date(reminderTime);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later

  return {
    summary: `🎯 Habit Reminder: ${habitTitle}`,
    description: `Time to work on your habit: ${habitDescription}\n\nCreated by HabitTracker App`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'America/New_York', // You can make this dynamic
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/New_York',
    },
    recurrence: generateHabitRecurrence(frequency),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
        { method: 'email', minutes: 60 },
      ],
    },
  };
}