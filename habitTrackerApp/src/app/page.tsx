'use client';

import { useState } from 'react';
import HabitModal from './components/habit-modal';
import ProgressTracker from "./components/progress-tracker";
import TasksAndReminders from "./components/tasks-and-reminders";
import ToDoList from "./components/todo-list";
import WeeklyStreak from "./components/weekly-streak";
import { Welcome } from "./components/welcome";

// Define the Habit type (matching the one in todo-list.tsx)
interface Habit {
  id: string;
  name: string;
  icon: string;
  interval: string;
  completed: boolean;
}

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);

  // Handle creating a new habit
  const handleCreateHabit = (name: string, icon: string, interval: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(), // Simple ID generation
      name,
      icon,
      interval,
      completed: false,
    };
    
    setHabits(prev => [...prev, newHabit]);
    setIsModalOpen(false);
  };

  // Handle toggling habit completion
  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  // Calculate progress for the progress tracker
  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Welcome onAddHabit={() => setIsModalOpen(true)} />
      <div className="mt-4 sm:mt-6 lg:mt-8">
        <WeeklyStreak />
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-24 items-start ml-0 sm:ml-4 lg:ml-8">
        <ProgressTracker progress={progressPercentage} />
        <TasksAndReminders />
        <ToDoList 
          habits={habits}
          onToggleHabit={handleToggleHabit}
        />
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