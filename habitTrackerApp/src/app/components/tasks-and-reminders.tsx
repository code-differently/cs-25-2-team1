import React from 'react';

const TasksAndReminders = () => {
  return (
    <div className="flex flex-col gap-4 w-64">
      {/* Tasks Completed Card */}
      <div className="flex items-start justify-center py-6 px-8 bg-gray-200 rounded-3xl h-44">
        <h3 className="text-lg font-semibold text-black">Tasks completed</h3>
      </div>
      
      {/* Reminders Card */}
      <div className="flex items-start justify-center py-6 px-8 bg-indigo-700 rounded-3xl h-44">
        <h3 className="text-lg font-semibold text-white">Reminders</h3>
      </div>
    </div>
  );
};

export default TasksAndReminders;
