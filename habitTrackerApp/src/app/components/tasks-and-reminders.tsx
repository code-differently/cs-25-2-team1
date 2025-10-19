import React from 'react';

const TasksAndReminders = () => {
  return (
    <div className="flex flex-col gap-4 w-full sm:w-64 lg:w-64">
      {/* Tasks Completed Card */}
      <div className="flex items-start justify-center py-6 px-4 sm:px-8 bg-gray-200 rounded-3xl h-36 sm:h-44">
        <h3 className="text-base sm:text-lg font-semibold text-black text-center">Tasks completed</h3>
      </div>
      
      {/* Reminders Card */}
      <div className="flex items-start justify-center py-6 px-4 sm:px-8 bg-indigo-700 rounded-3xl h-36 sm:h-44">
        <h3 className="text-base sm:text-lg font-semibold text-white text-center">Reminders</h3>
      </div>
    </div>
  );
};

export default TasksAndReminders;
