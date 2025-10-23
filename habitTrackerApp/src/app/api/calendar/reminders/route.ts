import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GoogleCalendarService, createHabitReminderEvent } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      habitId, 
      habitTitle, 
      habitDescription, 
      reminderTime, 
      frequency,
      googleAccessToken 
    } = body;

    if (!googleAccessToken) {
      return NextResponse.json({ 
        error: 'Google Calendar access token required' 
      }, { status: 400 });
    }

    // Create calendar service
    const calendarService = new GoogleCalendarService(googleAccessToken);

    // Create habit reminder event
    const eventData = createHabitReminderEvent(
      habitTitle,
      habitDescription,
      reminderTime,
      frequency
    );

    const calendarEvent = await calendarService.createRecurringHabitReminder(eventData);

    // Store the calendar event ID in your database
    const { error: dbError } = await supabase
      .from('habit_calendar_events')
      .insert({
        user_id: session.user.id,
        habit_id: habitId,
        google_event_id: calendarEvent.id,
        event_data: calendarEvent,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to clean up the calendar event if DB insert fails
      try {
        await calendarService.deleteHabitReminder(calendarEvent.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup calendar event:', cleanupError);
      }
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      eventId: calendarEvent.id,
      eventUrl: calendarEvent.htmlLink
    });

  } catch (error) {
    console.error('Calendar creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create calendar reminder' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const googleAccessToken = searchParams.get('accessToken');

    if (!googleAccessToken || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    const calendarService = new GoogleCalendarService(googleAccessToken);
    const events = await calendarService.getHabitEvents(startDate, endDate);

    return NextResponse.json({ events });

  } catch (error) {
    console.error('Calendar fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch calendar events' 
    }, { status: 500 });
  }
}