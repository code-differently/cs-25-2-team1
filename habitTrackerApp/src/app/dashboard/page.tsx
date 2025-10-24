'use client'
import { useClerk, useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { ensureUserExists } from '../../lib/userSync';
import HabitModal from '../components/habit-modal';
import MoodAndQuote from "../components/mood-and-quotes";
import ProgressTracker from "../components/progress-tracker";
import ToDoList from "../components/todo-list";
import WeeklyStreak from "../components/weekly-streak";
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
      // Ensure user profile exists for Clerk users using proper sync
      await ensureUserExists(user);

      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id_text', user.id); // Use user_id_text column
      if (habitsError) {
        console.error('Error fetching habits:', habitsError.message);
      } else if (habitsData) {
        // Map schema fields to component fields
        const mappedHabits = habitsData.map(habit => ({
          id: habit.id,
          name: habit.title, // Map title -> name for component
          icon: '📋', // Default icon since not stored in schema
          interval: habit.frequency, // Map frequency -> interval
          completed: false // Will be set based on completions
        }));
        setHabits(mappedHabits);
      }
      
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_logs') // Use correct table name
        .select('habit_id')
        .eq('user_id_text', user.id) // Use user_id_text column
        .gte('completed_at', new Date().toISOString().split('T')[0]) // Today's completions
        .lt('completed_at', new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);
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

  // Create habit in Supabase (supports daily, weekly, monthly)
  const handleCreateHabit = async (name: string, icon: string, interval: string) => {
    console.log('handleCreateHabit called with:', { name, icon, interval });
    
    if (!user) {
      console.error('No user found when creating habit');
      return;
    }
    
    try {
      console.log('User:', user.id);
      
      // First ensure user profile exists using proper sync
      console.log('Ensuring user exists...');
      const userSyncResult = await ensureUserExists(user);
      console.log('User sync result:', userSyncResult);

      // Habit object with both old and new user ID columns for compatibility
      const newHabit = {
        user_id: null, // Set old column to null (will be nullable after migration)
        user_id_text: user.id, // Use user_id_text for Clerk compatibility
        title: name, // Use 'title' to match schema
        frequency: interval.toLowerCase(), // Use 'frequency' to match schema  
      };
      
      console.log('Creating habit:', newHabit);
      
      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select();
      
      if (error) {
        console.error('Error creating habit:', error.message);
        console.error('Full error details:', error);
        return;
      }
      
      console.log('Habit created successfully:', data);
      
      // Refetch all habits to update the UI
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id_text', user.id);
        
      if (habitsError) {
        console.error('Error fetching habits:', habitsError.message);
      } else if (habitsData) {
        const mappedHabits = habitsData.map(habit => ({
          id: habit.id,
          name: habit.title,
          icon: '📋',
          interval: habit.frequency,
          completed: false
        }));
        console.log('Refetched habits after creation:', mappedHabits);
        setHabits(mappedHabits);
      }
      
      // Refetch completions
      const { data: completionsData, error: completionsError } = await supabase
        .from('habit_logs')
        .select('habit_id')
        .eq('user_id_text', user.id)
        .gte('completed_at', new Date().toISOString().split('T')[0])
        .lt('completed_at', new Date(Date.now() + 24*60*60*1000).toISOString().split('T')[0]);
        
      if (completionsError) {
        console.error('Error fetching completions:', completionsError.message);
      } else if (completionsData) {
        setCompletions(completionsData);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error in handleCreateHabit:', error);
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
        .from('habit_logs') // Use correct table name
        .delete()
        .eq('habit_id', habitId)
        .eq('user_id_text', user.id) // Use user_id_text column
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
      .from('habit_logs') // Use correct table name
      .insert([
        {
          habit_id: habitId,
          user_id_text: user.id, // Use user_id_text column
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
