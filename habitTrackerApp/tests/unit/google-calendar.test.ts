// Mock google APIs
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
      })),
    },
    calendar: jest.fn().mockImplementation(() => ({
      events: {
        insert: jest.fn(),
        list: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
      },
    })),
  },
}));

import { google } from 'googleapis';
import {
    GoogleCalendarService,
    createHabitReminderEvent,
    generateHabitRecurrence
} from '../../src/lib/google-calendar';

const mockCalendar = {
  events: {
    insert: jest.fn(),
    list: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
};

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;
  const mockAccessToken = 'mock_access_token';

  beforeEach(() => {
    jest.clearAllMocks();
    (google.calendar as jest.Mock).mockReturnValue(mockCalendar);
    service = new GoogleCalendarService(mockAccessToken);
  });

  describe('createHabitReminder', () => {
    it('should create a habit reminder event', async () => {
      const mockEvent = {
        summary: 'Test Habit',
        description: 'Test Description',
        start: { dateTime: '2024-01-01T10:00:00Z' },
        end: { dateTime: '2024-01-01T11:00:00Z' },
      };

      const mockResponse = { data: { id: 'event123', ...mockEvent } };
      mockCalendar.events.insert.mockResolvedValueOnce(mockResponse);

      const result = await service.createHabitReminder(mockEvent);

      expect(mockCalendar.events.insert).toHaveBeenCalledWith({
        calendarId: 'primary',
        requestBody: {
          ...mockEvent,
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 },
            ],
          },
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating habit reminder', async () => {
      const mockEvent = {
        summary: 'Test Habit',
        start: { dateTime: '2024-01-01T10:00:00Z' },
        end: { dateTime: '2024-01-01T11:00:00Z' },
      };

      const mockError = new Error('Calendar API error');
      mockCalendar.events.insert.mockRejectedValueOnce(mockError);

      await expect(service.createHabitReminder(mockEvent)).rejects.toThrow('Calendar API error');
    });
  });

  describe('getHabitEvents', () => {
    it('should fetch habit-related events', async () => {
      const mockEvents = [
        { id: 'event1', summary: 'Habit: Exercise' },
        { id: 'event2', summary: 'Habit: Reading' },
      ];
      const mockResponse = { data: { items: mockEvents } };
      mockCalendar.events.list.mockResolvedValueOnce(mockResponse);

      const result = await service.getHabitEvents('2024-01-01', '2024-01-31');

      expect(mockCalendar.events.list).toHaveBeenCalledWith({
        calendarId: 'primary',
        timeMin: '2024-01-01',
        timeMax: '2024-01-31',
        q: 'habit',
        singleEvents: true,
        orderBy: 'startTime',
      });
      expect(result).toEqual(mockEvents);
    });

    it('should return empty array when no events found', async () => {
      const mockResponse = { data: {} };
      mockCalendar.events.list.mockResolvedValueOnce(mockResponse);

      const result = await service.getHabitEvents('2024-01-01', '2024-01-31');

      expect(result).toEqual([]);
    });
  });

  describe('updateHabitReminder', () => {
    it('should update a habit reminder', async () => {
      const eventId = 'event123';
      const updateData = { summary: 'Updated Habit' };
      const mockResponse = { data: { id: eventId, ...updateData } };
      
      mockCalendar.events.patch.mockResolvedValueOnce(mockResponse);

      const result = await service.updateHabitReminder(eventId, updateData);

      expect(mockCalendar.events.patch).toHaveBeenCalledWith({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: updateData,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteHabitReminder', () => {
    it('should delete a habit reminder', async () => {
      const eventId = 'event123';
      mockCalendar.events.delete.mockResolvedValueOnce({});

      await service.deleteHabitReminder(eventId);

      expect(mockCalendar.events.delete).toHaveBeenCalledWith({
        calendarId: 'primary',
        eventId: eventId,
      });
    });
  });

  describe('createRecurringHabitReminder', () => {
    it('should create a recurring habit reminder', async () => {
      const mockEvent = {
        summary: 'Daily Habit',
        description: 'Daily habit reminder',
        start: { dateTime: '2024-01-01T10:00:00Z' },
        end: { dateTime: '2024-01-01T11:00:00Z' },
        recurrence: ['RRULE:FREQ=DAILY'],
      };

      const mockResponse = { data: { id: 'recurring123', ...mockEvent } };
      mockCalendar.events.insert.mockResolvedValueOnce(mockResponse);

      const result = await service.createRecurringHabitReminder(mockEvent);

      expect(mockCalendar.events.insert).toHaveBeenCalledWith({
        calendarId: 'primary',
        requestBody: mockEvent,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe('generateHabitRecurrence', () => {
  it('should generate daily recurrence', () => {
    const result = generateHabitRecurrence('daily');
    expect(result).toEqual(['RRULE:FREQ=DAILY']);
  });

  it('should generate weekly recurrence', () => {
    const result = generateHabitRecurrence('weekly');
    expect(result).toEqual(['RRULE:FREQ=WEEKLY']);
  });

  it('should generate monthly recurrence', () => {
    const result = generateHabitRecurrence('monthly');
    expect(result).toEqual(['RRULE:FREQ=MONTHLY']);
  });
});

describe('createHabitReminderEvent', () => {
  it('should create a habit reminder event with daily frequency', () => {
    const result = createHabitReminderEvent(
      'Exercise',
      'Daily exercise routine',
      '2024-01-01T10:00:00Z',
      'daily'
    );

    expect(result).toEqual({
      summary: 'Habit: Exercise',
      description: 'Daily exercise routine',
      start: {
        dateTime: '2024-01-01T10:00:00Z',
        timeZone: 'UTC',
      },
      end: {
        dateTime: '2024-01-01T10:30:00Z',
        timeZone: 'UTC',
      },
      recurrence: ['RRULE:FREQ=DAILY'],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 15 },
          { method: 'email', minutes: 60 },
        ],
      },
    });
  });

  it('should create a habit reminder event with weekly frequency', () => {
    const result = createHabitReminderEvent(
      'Reading',
      'Weekly reading session',
      '2024-01-01T19:00:00Z',
      'weekly'
    );

    expect(result.recurrence).toEqual(['RRULE:FREQ=WEEKLY']);
    expect(result.summary).toBe('Habit: Reading');
  });

  it('should create a habit reminder event with monthly frequency', () => {
    const result = createHabitReminderEvent(
      'Review Goals',
      'Monthly goal review',
      '2024-01-01T15:00:00Z',
      'monthly'
    );

    expect(result.recurrence).toEqual(['RRULE:FREQ=MONTHLY']);
    expect(result.summary).toBe('Habit: Review Goals');
  });
});