import React from 'react';

const ProgressTracker = () => {
  const percentage = 100;
  const completed = 10;
  const inProgress = 0;
  const pending = 0;

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-200 rounded-3xl">
      {/* Title */}
      <h2 className="text-xl font-semibold text-black">Progress Tracker</h2>
      
      {/* Circular Progress */}
      <div className="relative w-48 h-48">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="#4338ca"
            strokeWidth="16"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-black">{percentage}%</span>
          <span className="text-lg text-black">Completed</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6">
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
