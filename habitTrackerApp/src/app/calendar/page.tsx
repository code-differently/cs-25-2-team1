import React from 'react';

export default function Calendar() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
      <p className="text-blue-600 font-bold text-xl mb-6">Calendar page is working! 📅</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Habit Calendar</h2>
        <p className="text-gray-600">
          Track your habits over time with a visual calendar view. 
          This page will show your habit completion patterns and streaks.
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            🔧 This is a placeholder page. Calendar functionality will be implemented soon!
          </p>
        </div>
      </div>
    </div>
  );
}
