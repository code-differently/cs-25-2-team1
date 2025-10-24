'use client'
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import HabitModal from '../components/habit-modal';
import ProgressTracker from "../components/progress-tracker";
import MoodAndQuote from "../components/mood-and-quotes";
import ToDoList from "../components/todo-list";
import WeeklyStreak from "../components/weekly-streak";
import Confetti from 'react-confetti';
import { Welcome } from "../components/welcome";

// Define the Habit type (matching the one in todo-list.tsx)
interface Habit {
  id: string;
  name: string;
  icon: string;
  interval: string;
  completed: boolean;
}

export default function Dashboard() {
  const [showDailyConfetti, setShowDailyConfetti] = useState(false);
  const [showWeeklyConfetti, setShowWeeklyConfetti] = useState(false);
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<{ habit_id: string }[]>([]);
  const supabase = createClientComponentClient();


  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);

  // Fetch all habits and completions from Supabase for current user
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
        .eq('completed_at', new Date().toISOString().split('T')[0]); // Only today's completions
      if (completionsError) {
        console.error('Error fetching completions:', completionsError.message);
      } else if (completionsData) {
        setCompletions(completionsData);
      }
    };
    if (isLoaded && user) {
      fetchHabitsAndCompletions();
    }
  }, [isLoaded, user]);

  // Create daily habit in Supabase
  const handleCreateHabit = async (name: string, icon: string, interval: string) => {
    if (!user) return;
    if (interval !== 'Daily') return; // Only allow daily habits from dashboard
    const newHabit = {
      user_id: user.id,
      name,
      icon,
      interval,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('habits')
      .insert([newHabit]);
    if (error) {
      console.error('Error creating daily habit:', error.message);
    } else {
      // Refetch daily habits after insert
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('interval', 'Daily');
      if (habitsError) {
        console.error('Error fetching daily habits:', habitsError.message);
      } else if (habitsData) {
        setHabits(habitsData);
      }
      setIsModalOpen(false);
    }
  };

  // Handle toggling habit completion
  // Mark habit as completed in Supabase
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

  // Calculate progress for the progress tracker
  const completedHabits = habits.filter(habit => completions.some(c => c.habit_id === habit.id)).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  // Confetti for 100% daily completion
  useEffect(() => {
    if (progressPercentage === 100) {
      setShowDailyConfetti(true);
      setTimeout(() => setShowDailyConfetti(false), 3000);
    }
    // Example: trigger weekly confetti if all days in WeeklyStreak are completed (customize as needed)
    // setShowWeeklyConfetti(true); setTimeout(() => setShowWeeklyConfetti(false), 3000);
  }, [progressPercentage]);

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

  const firstName = user?.firstName || "";
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
      {showDailyConfetti && (
        <Confetti numberOfPieces={200} recycle={false} width={window.innerWidth} height={window.innerHeight} />
      )}
      {showWeeklyConfetti && (
        <Confetti numberOfPieces={400} recycle={false} width={window.innerWidth} height={window.innerHeight} colors={["#6366F1", "#F59E42", "#34D399"]} />
      )}
      <Welcome onAddHabit={() => setIsModalOpen(true)} userName={firstName} />
      <div className="mt-4 sm:mt-6 lg:mt-8">
        <WeeklyStreak habits={habits.map(habit => ({
          ...habit,
          completed: completions.some(c => c.habit_id === habit.id)
        }))} />
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-24 items-start ml-0 sm:ml-4 lg:ml-8">
        <ProgressTracker progress={progressPercentage} />
        <MoodAndQuote />
        <ToDoList 
          habits={habits.map(habit => ({
            ...habit,
            completed: completions.some(c => c.habit_id === habit.id)
          }))}
          onToggleHabit={handleToggleHabit}
          onDeleteHabit={async (habitId: string) => {
            if (!user) return;
            const { error } = await supabase
              .from('habits')
              .delete()
              .eq('id', habitId)
              .eq('user_id', user.id);
            if (error) {
              alert('Error deleting habit: ' + error.message);
            } else {
              setHabits(habits => habits.filter(h => h.id !== habitId));
              setCompletions(completions => completions.filter(c => c.habit_id !== habitId));
            }
          }}
        />
      </div>

      {/* Habit Creation Modal*/}
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateHabit={handleCreateHabit}
      />
    </div>
  );
}
