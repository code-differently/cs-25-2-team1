
import { useMemo } from 'react';

interface Habit {
  id: string;
  name: string;
  icon: string;
  interval: string;
  completed: boolean;
}

const dayLabels = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];

interface WeeklyStreakProps {
  habits: Habit[];
}

const WeeklyStreak: React.FC<WeeklyStreakProps> = ({ habits = [] }) => {
  // Get current week dates
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

  // Build array of dates for the week (Monday-Sunday)
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // For each day, check if all habits for that day are completed
  const days = useMemo(() => {
    const todayIdx = new Date().getDay(); // 0 (Sun) - 6 (Sat)
    return weekDates.map((date, idx) => {
      // Only daily habits
      const dailyHabits = habits.filter(h => h.interval === 'Daily');
      // Only light up the oval for the current day if all daily habits are complete
      const isToday = idx === todayIdx;
      const allCompleted = isToday && dailyHabits.length > 0 && dailyHabits.every(h => h.completed);
      return {
        label: dayLabels[idx],
        completed: allCompleted,
      };
    });
  }, [habits, weekDates]);

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:py-8 px-4 sm:px-6 bg-white rounded-3xl shadow-sm w-full">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-black">Weekly streak</h2>
      {/* Days Container */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 overflow-x-auto w-full justify-center">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Day Pill */}
            <div
              className={`w-10 sm:w-12 lg:w-14 h-20 sm:h-28 lg:h-32 rounded-full transition-colors duration-200 ${
                day.completed
                  ? 'bg-indigo-700'
                  : 'bg-white border-2 border-indigo-700'
              }`}
            />
            {/* Day Label */}
            <span className="text-xs sm:text-sm font-medium text-black">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyStreak;
