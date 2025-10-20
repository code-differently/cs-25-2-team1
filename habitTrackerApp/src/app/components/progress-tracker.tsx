import React from 'react';

interface ProgressTrackerProps {
  progress?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress = 0 }) => {
  const percentage = Math.round(progress);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-gray-200 rounded-3xl w-full lg:w-auto">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-black">Progress Tracker</h2>
      
      {/* Circular Progress */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#4338ca"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black">{percentage}%</span>
          <span className="text-sm sm:text-base lg:text-lg text-black">Completed</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Completed */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-indigo-700" />
          <span className="text-xs text-black">Completed</span>
        </div>
        
        {/* In Progress */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-black">In Progress</span>
        </div>
        
        {/* Pending */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-xs text-black">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
