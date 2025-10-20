import React from 'react';

interface ProgressTrackerProps {
  progress?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress = 0 }) => {
  const percentage = Math.round(progress);
  
  // Determine the stroke color based on progress
  const getProgressColor = () => {
    if (percentage === 0) return "#9ca3af"; // Grey for no progress (pending)
    if (percentage < 50) return "#3b82f6";  // Blue for in progress
    return "#4338ca";                       // Indigo for good progress
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-gray-200 rounded-3xl w-full lg:w-auto">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-black">Progress Tracker</h2>
      
      {/* Circular Progress - Made Bigger with more spacing */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60">
        {/* Background Circle - Visible Gray for incomplete tasks */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#6b7280"
            strokeWidth="8"
            fill="none"
            opacity="0.7"
          />
          {/* Progress Circle - Only shows completed portion */}
          {percentage > 0 && (
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke={getProgressColor()}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-normal text-black text-center leading-none">{percentage}%</span>
          <span className="text-xs sm:text-sm lg:text-base text-black text-center -mt-0.5">
            {percentage === 0 ? 'Pending' : percentage === 100 ? 'Complete' : 'In Progress'}
          </span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Pending */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-xs text-black">Pending</span>
        </div>
        
        {/* In Progress */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-black">In Progress</span>
        </div>
        
        {/* Completed */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-indigo-700" />
          <span className="text-xs text-black">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
