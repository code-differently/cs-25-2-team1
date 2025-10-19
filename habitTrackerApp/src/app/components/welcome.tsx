import { FC } from "react";

export interface WelcomeProps {
    userName?: string;
    className?: string;
}

export const Welcome: FC<WelcomeProps> = ({ userName = "Jane", className = "" }) => {
    return (
        <div className="flex items-center justify-between px-8 py-6 bg-gray-50">
      {/* Welcome Message */}
      <h1 className="text-5xl font-normal text-black">
        Welcome in, <span className="font-semibold">{userName}</span>
      </h1>
      
      {/* Buttons Container */}
      <div className="flex items-center gap-4">
        {/* Add Task Button */}
        <button className="px-8 py-2 text-white text-base font-medium bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
          Add Habit
        </button>
        
        {/* Journal Button */}
        <button className="px-8 py-2 text-indigo-700 text-base font-medium bg-white border-2 border-indigo-700 rounded-full hover:bg-indigo-50 transition-colors">
          Journal
        </button>
      </div>
    </div>
    );
};
