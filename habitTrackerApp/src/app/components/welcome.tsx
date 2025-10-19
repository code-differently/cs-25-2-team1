import { FC } from "react";

export interface WelcomeProps {
    userName?: string;
    className?: string;
}

export const Welcome: FC<WelcomeProps> = ({ userName = "Jane", className = "" }) => {
    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50 gap-4 sm:gap-0 ${className}`}>
      {/* Welcome Message */}
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-normal text-black">
        Welcome in, <span className="font-semibold">{userName}</span>
      </h1>
      
      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Add Task Button */}
        <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 text-white text-sm sm:text-base font-medium bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
          Add Habit
        </button>
        
        {/* Journal Button */}
        <button className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 text-indigo-700 text-sm sm:text-base font-medium bg-white border-2 border-indigo-700 rounded-full hover:bg-indigo-50 transition-colors">
          Journal
        </button>
      </div>
    </div>
    );
};
