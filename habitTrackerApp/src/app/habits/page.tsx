'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import ProgressTracker from '../components/progress-tracker';
import WeeklyStreak from '../components/weekly-streak';
import Confetti from 'react-confetti';
import { createElement } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import HabitModal from '../components/habit-modal';
import { CheckCircle, Circle, Zap, Lightbulb, Heart, Briefcase, Check, Lock, Coffee, Sparkles } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  interval: string;
  completed: boolean;
  color: string;
}

const INTERVALS = ['Daily', 'Weekly', 'Monthly'];
const COLORS = [
  'bg-yellow-300',
  'bg-blue-500',
  'bg-teal-400',
  'bg-pink-300',
  'bg-purple-400',
  'bg-indigo-600',
  'bg-amber-400',
  'bg-blue-300',
  'bg-green-400',
  'bg-red-300',
  'bg-orange-400',
];
const iconMap = {
  'zap': Zap,
  'lightbulb': Lightbulb,
  'heart': Heart,
  'briefcase': Briefcase,
  'check': Check,
  'lock': Lock,
  'coffee': Coffee,
  'sparkles': Sparkles,
};

export default function Habits() {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const calendarRef = useRef<any>(null);
  
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const [showWeeklyConfetti, setShowWeeklyConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<{ habit_id: string }[]>([]);
  const [selectedInterval, setSelectedInterval] = useState<string>('Daily');

  // Helper function
  const getCalendarView = (interval: string) => {
    if (interval === 'Daily') return 'dayGridDay';
    if (interval === 'Weekly') return 'dayGridWeek';
    if (interval === 'Monthly') return 'dayGridMonth';
    return 'dayGridMonth';
  };

  const getIntervalColor = (interval: string) => {
    if (interval === 'Daily') return '#bfdbfe';
    if (interval === 'Weekly') return '#fecaca';
    if (interval === 'Monthly') return '#fef9c3';
    return '#f3f4f6';
  };

  // Calculate filtered habits and progress
  const filteredHabits = habits.filter(habit => {
    if (selectedInterval === 'Daily') return habit.interval === 'Daily';
    if (selectedInterval === 'Weekly') return habit.interval === 'Daily' || habit.interval === 'Weekly';
    if (selectedInterval === 'Monthly') return habit.interval === 'Daily' || habit.interval === 'Weekly' || habit.interval === 'Monthly';
    return false;
  });
  const completedCount = filteredHabits.filter(habit => completions.some(c => c.habit_id === habit.id)).length;
  const progress = filteredHabits.length > 0 ? (completedCount / filteredHabits.length) * 100 : 0;

  // ALL useEffect HOOKS - MUST BE BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    const fetchHabitsAndCompletions = async () => {
      if (!user) return;
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);
      if (habitsError) {
        console.error('Error fetching habits:', habitsError.message);
      } else if (habitsData) {
        setHabits(habitsData);
      }
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_at', new Date().toISOString().split('T')[0]);
      if (completionsError) {
        console.error('Error fetching completions:', completionsError.message);
      } else if (completionsData) {
        setCompletions(completionsData);
      }
    };
    if (isLoaded && user) {
      fetchHabitsAndCompletions();
    }
  }, [isLoaded, user, supabase]);

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi?.();
    if (calendarApi) {
      Promise.resolve().then(() => {
        calendarApi.changeView(getCalendarView(selectedInterval));
      });
    }
  }, [selectedInterval]);

  useEffect(() => {
    if (selectedInterval === 'Daily' && progress === 100 && filteredHabits.length > 0) {
      setShowDailyConfetti(true);
      setTimeout(() => setShowDailyConfetti(false), 5000);
    }
    if (selectedInterval === 'Weekly' && progress === 100 && filteredHabits.length > 0) {
      setShowWeeklyConfetti(true);
      setTimeout(() => setShowWeeklyConfetti(false), 5000);
    }
  }, [progress, selectedInterval, filteredHabits.length]);

  // NOW WE CAN HAVE CONDITIONAL RETURNS
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5B4CCC] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Event handlers
  const handleCreateHabit = async (name: string, icon: string, interval: string) => {
    if (!user) return;
    const newHabit = {
      user_id: user.id,
      name,
      icon,
      interval,
      color: getIntervalColor(interval),
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('habits')
      .insert([newHabit]);
    if (error) {
      console.error('Error creating habit:', error.message);
    } else {
      // Refetch habits after insert
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);
      if (habitsError) {
        console.error('Error fetching habits:', habitsError.message);
      } else if (habitsData) {
        setHabits(habitsData);
      }
      setIsModalOpen(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!user) return;
    const alreadyCompleted = completions.some(c => c.habit_id === habitId);
    if (alreadyCompleted) {
      // Remove completion
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .eq('completed_at', new Date().toISOString().split('T')[0]);
      if (error) {
        console.error('Error removing completion:', error.message);
      } else {
        setCompletions(prev => prev.filter(c => c.habit_id !== habitId));
      }
      return;
    }
    // Add completion
    const { error } = await supabase
      .from('habit_completions')
      .insert([
        {
          habit_id: habitId,
          user_id: user.id,
          completed_at: new Date().toISOString().split('T')[0],
        },
      ]);
    if (error) {
      console.error('Error marking habit completed:', error.message);
    } else {
      setCompletions(prev => [...prev, { habit_id: habitId }]);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', user.id);
    if (error) {
      alert('Error deleting habit: ' + error.message);
    } else {
      setHabits(habits => habits.filter(h => h.id !== habitId));
    }
  };

  // Calendar events
  const calendarEvents = habits
    .filter(habit => {
      if (selectedInterval === 'Daily') return habit.interval === 'Daily';
      if (selectedInterval === 'Weekly') return habit.interval === 'Daily' || habit.interval === 'Weekly';
      if (selectedInterval === 'Monthly') return habit.interval === 'Daily' || habit.interval === 'Weekly' || habit.interval === 'Monthly';
      return false;
    })
    .map(habit => ({
      id: habit.id,
      title: habit.name,
      start: new Date().toISOString().split('T')[0],
      color: getIntervalColor(habit.interval),
      extendedProps: {
        icon: habit.icon,
        completed: completions.some(c => c.habit_id === habit.id),
      },
    }));

  const eventContent = (arg: any) => {
    const iconId = arg.event.extendedProps.icon;
    const IconComponent = iconMap[iconId as keyof typeof iconMap];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {IconComponent && createElement(IconComponent, { style: { width: 18, height: 18 } })}
        <span>{arg.event.title}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
      {showDailyConfetti && (
        <Confetti numberOfPieces={200} recycle={false} width={window.innerWidth} height={window.innerHeight} />
      )}
      {showWeeklyConfetti && (
        <Confetti numberOfPieces={400} recycle={false} width={window.innerWidth} height={window.innerHeight} colors={["#6366F1", "#F59E42", "#34D399"]} />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Habits</h1>
        <div className="flex gap-2">
          {INTERVALS.map(interval => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={`px-4 py-2 rounded-full font-semibold border transition-colors ${selectedInterval === interval ? 'bg-indigo-700 text-white border-indigo-700' : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100'}`}
            >
              {interval}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-700 text-white rounded-full font-semibold hover:bg-indigo-800 transition-colors"
        >
          Add Habit
        </button>
      </div>
      
      {/* Habits List with completion checkbox - only show if there are habits */}
      {filteredHabits.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
          <ul className="divide-y divide-gray-200">
            {filteredHabits.map(habit => (
              <li key={habit.id} className="flex items-center py-3 gap-4">
                <input
                  type="checkbox"
                  checked={completions.some(c => c.habit_id === habit.id)}
                  onChange={() => handleToggleHabit(habit.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="font-medium text-gray-900">{habit.name}</span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{habit.interval}</span>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="ml-auto px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  title="Delete habit"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
        <style>{`
          .fc .fc-toolbar-title,
          .fc .fc-col-header-cell-cushion,
          .fc .fc-daygrid-day-number,
          .fc .fc-daygrid-day.fc-day-other .fc-daygrid-day-number,
          .fc .fc-daygrid-event,
          .fc .fc-timegrid-slot-label,
          .fc .fc-timegrid-event {
            color: #111 !important;
          }
        `}</style>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={getCalendarView(selectedInterval)}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          buttonText={{ today: 'Today' }}
          events={calendarEvents}
          eventContent={eventContent}
          height="auto"
        />
      </div>
      <div className="mb-8">
        <ProgressTracker progress={progress} />
      </div>
      {/* Habit Creation Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateHabit={handleCreateHabit}
      />
    </div>
  );
}