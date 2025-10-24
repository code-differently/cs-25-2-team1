'use client'

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Journaling() {
  const { user, isLoaded } = useUser();
  const supabase = createClientComponentClient();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [noteDates, setNoteDates] = useState<string[]>([]);

  // Fetch note for selected date
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('journal_entries')
      .select('note')
      .eq('user_id', user.id)
      .eq('date', selectedDate)
      .single()
      .then(({ data, error }) => {
        setNote(data?.note || '');
        setLoading(false);
      });
  }, [selectedDate, user, supabase]);

  // Fetch all dates with notes for visual indicator
  useEffect(() => {
    if (!user) return;
    supabase
      .from('journal_entries')
      .select('date')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setNoteDates(data ? data.map((entry: { date: string }) => entry.date) : []);
      });
  }, [user, note, selectedDate, supabase]);

  // Save note
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('journal_entries')
      .upsert(
        { user_id: user.id, date: selectedDate, note },
        { onConflict: 'user_id,date' }
      );
    setLoading(false);
    if (error) alert('Error saving note: ' + error.message);
  };

  // Calendar date click handler
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
  };

  // Custom event renderer to show dot for days with notes
  const eventContent = (arg: any) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>{arg.event.title}</span>
      </div>
    );
  };

  // Generate events for days with notes
  const noteEvents = noteDates.map(date => ({
    title: '',
    start: date,
    display: 'background',
    backgroundColor: '#6366F1', // indigo
    className: 'journal-note-dot'
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Journaling</h1>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 mb-8">
        <style>{`
          .fc-daygrid-day.fc-day-today {
            background-color: #e0e7ff !important;
          }
          .journal-note-dot {
            position: relative;
          }
          .journal-note-dot::after {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            background: #6366F1;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 80%;
            transform: translate(-50%, -50%);
          }
        `}</style>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          events={noteEvents}
          eventContent={eventContent}
          height="auto"
        />
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900 text-center sm:text-left">Notes for {selectedDate}</h2>
        </div>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 text-gray-900 text-base"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write your thoughts, reflections, or notes for today..."
          disabled={loading}
        />
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-700 text-white rounded-full font-semibold hover:bg-indigo-800 transition-colors self-end"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}
