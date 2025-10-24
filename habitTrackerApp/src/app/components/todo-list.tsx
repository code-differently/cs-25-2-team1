
import { Briefcase, Check, CheckCircle, Circle, Coffee, Heart, Lightbulb, Lock, Sparkles, Zap } from "lucide-react";
import { FC } from "react";

export interface Habit {
  id: string;
  name: string;
  icon: string;
  interval: string;
  completed: boolean;
}

export interface TodoListProps {
  className?: string;
  habits?: Habit[];
  onToggleHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

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

const ToDoList: FC<TodoListProps> = ({ 
  className = "", 
  habits = [],
  onToggleHabit,
  onDeleteHabit
}) => {
  return (
    <div className={`flex flex-col w-full lg:w-64 ${className}`}>
      {/* To Do List Card */}
      <div className="flex flex-col py-6 px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-3xl h-80 sm:h-96">
        <h3 className="text-base sm:text-lg font-semibold text-black text-center mb-4">My Habits</h3>
        <div className="flex-1 overflow-y-auto space-y-3">
          {habits.length === 0 ? (
            <p className="text-gray-500 text-sm text-center px-2">No habits yet. Click &quot;Add Habit&quot; to get started!</p>
          ) : (
            habits.map((habit) => {
              const IconComponent = iconMap[habit.icon as keyof typeof iconMap];
              return (
                <div 
                  key={habit.id}
                  className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="cursor-pointer" onClick={() => onToggleHabit?.(habit.id)}>
                    {habit.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  {IconComponent && <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${habit.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {habit.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{habit.interval}</p>
                  </div>
                  <button
                    className="ml-auto px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    title="Delete habit"
                    onClick={() => onDeleteHabit?.(habit.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
